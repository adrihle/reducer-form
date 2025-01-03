import { render, RenderResult, screen } from "@testing-library/react";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { useForm, useFormContext } from "../src";
import { FormProvider, FormProviderProps } from "../src/context";
import { ObserverReducer } from "../src/useForm";

// ------------GENERIC COMPONENTS STRUCTURE
function Input<T extends object>({ name }:  { name: keyof T }) {
  const { register } = useFormContext<T>();
  return (
    <input {...register({ name })} data-testid={name} />
  );
};

type SelectOption = { value: string, label: string };

function Select<T>({ name, options = [] }: { name: keyof T, options: SelectOption[] }) {
  const { register } = useFormContext<T>();
  return (
    <select {...register({ name })} data-testid={name}>
      {options.map(({ value, label }) => <option value={value} key={value}>{label}</option>)}
    </select>
  );
};

type FormProps<T> = FormProviderProps<T>;

// comprobar que no llega ya un boton tipo submit, y pintar por defecto
function Form<T>({ children, ...form }: FormProps<T>) {
  const { onsubmit } = form;
  return (
    <FormProvider<T> {...form}>
      <form onSubmit={onsubmit}>
        {children}
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

// ------------BUSINESS CONTAINER
type FormParams = {
  name: string;
  surname: string;
  option: string;
};

const observer = jest.fn();
const onSubmit = jest.fn();

const reducer: ObserverReducer<FormParams> = (state, action) => {
  observer();
  return { ...state, [action.name]: action.value };
};

const Playground = () => {
  const form = useForm<FormParams>({
    initial: { name: 'pajarito' },
    reducers: [reducer],
    onSubmit,
  });

  const options = ['op1', 'op2', 'op3'].map((value) => ({ value, label: value }));

  return (
    <Form {...form}>
      <Input<FormParams> name="name" />
      <Input<FormParams> name="surname" />
      <Select<FormParams> name="option" {...{ options }}/>
    </Form>
  );
};
// ------------


describe('context', () => {
  let container: RenderResult;
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  });

  beforeEach(() => {
    container = render(<Playground />)
    expect(container).not.toBeNull();
  });

  afterEach(() => {
    container.unmount();
  });

  it('Should work correctly using context form', async () => {
    const inputEl = screen.getByTestId('name');
    expect(inputEl).not.toBeNull();

    const inputEl2 = screen.getByTestId('surname');
    expect(inputEl2).not.toBeNull();

    await user.clear(inputEl);
    await user.type(inputEl, 'macareno');
    await user.type(inputEl2, 'otracosa');

    const selectEl = screen.getByTestId('option');
    expect(selectEl).not.toBeNull();

    await user.selectOptions(selectEl, 'op1');

    expect(observer).toHaveBeenCalled();

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledWith<[FormParams]>({ name: 'macareno', surname: 'otracosa', option: 'op1' });
  });
})
