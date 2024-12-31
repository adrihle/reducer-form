import { render, RenderResult, screen } from "@testing-library/react";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { useForm, useFormContext } from "../src";
import { Provider, ProviderProps } from "../src/context";
import { ObserverReducer } from "../src/useForm";

// ------------GENERIC COMPONENTS STRUCTURE
const Input = ({ name }: { name: string }) => {
  const { register } = useFormContext();
  return (
    <input {...register({ name: name as never })} data-testid={name} />
  );
};

const Select = ({ name, options = [] }: any) => {
  const { register } = useFormContext();
  return (
    <select {...register({ name: name as never })} data-testid={name}>
      {options.map(({ value, label }: any) => <option value={value} key={value}>{label}</option>)}
    </select>
  );
};

type FormProps<T> = ProviderProps<T> & { onSubmit: (e: T) => void };

function Form<T>({ children, onSubmit, ...form }: FormProps<T>) {
  const { onsubmit } = form;
  return (
    <Provider<T> {...form}>
      <form onSubmit={onsubmit(onSubmit)}>
        {children}
        <button type="submit">submit</button>
      </form>
    </Provider>
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
  return {
    ...state,
    [action.name]: action.value,
  };
};

const Playground = () => {
  const form = useForm<FormParams>({
    initial: { name: 'pajarito' },
    reducers: [reducer],
  });

  const { state, errors } = form;
  return (
    <Form {...form} onSubmit={onSubmit}>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <Input name="name" />
      <Input name="surname" />
      <Select name="option" options={[{ value: 'op1', label: 'op1' }, { value: 'op2', label: 'op2' }]} />
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
