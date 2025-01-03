import { useFormContext, useForm, FormProviderProps, FormProvider, ObserverReducer, UseFormParams } from '../src';

// --------- implementation components
function Input<T extends object>({ name }: { name: keyof T }) {
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


// --------------- domain components
const TEST_IDS = {
  name: 'name',
  surname: 'surname',
  option: 'option',
} as const;

type FormParams = {
  name: string;
  surname: string;
  option: string;
};

type ContextFormProps<T> = {
  observer: () => void;
  onSubmit: UseFormParams<T>['onSubmit'];
};

const ContextForm = ({ onSubmit, observer }: ContextFormProps<FormParams>) => {

  const reducer: ObserverReducer<FormParams> = (state, action) => {
    observer();
    return { ...state, [action.name]: action.value };
  };

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
      <Select<FormParams> name="option" {...{ options }} />
    </Form>
  );
};

export { ContextForm, TEST_IDS };
export type { FormParams };
