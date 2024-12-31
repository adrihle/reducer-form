import { ObserverReducer, useForm } from '../src/useForm';

const TEST_IDS = {
  input1: 'input1',
  input2: 'input2',
  input3: 'input3',
  form: 'form',
  error1: 'error1',
  error2: 'error2',
  error3: 'error3',
} as const;

type FormValues = {
  name?: string;
  surname?: string;
  email?: string;
};

type BaseFormProps = {
  onSubmit: (values: FormValues) => void;
  reducers?: ObserverReducer<FormValues>[];
  initial?: FormValues;
  errorsOnChange?: boolean;
};

const BaseForm = ({ reducers = [], onSubmit, initial, errorsOnChange }: BaseFormProps) => {
  const { onsubmit, register, state, errors } = useForm<FormValues>({
    initial,
    reducers,
    errorsOnChange,
  });

  return (
    <form onSubmit={onsubmit(onSubmit)} data-testid="form">
      <div>
        <div>{state.name}</div>
        <input {...register({ name: 'name', required: true })} data-testid={TEST_IDS.input1} />
        {errors.name && <div data-testid={TEST_IDS.error1}>error</div>}
      </div>

      <div>
        <div>{state.surname}</div>
        <input {...register({ name: 'surname', required: true })} data-testid={TEST_IDS.input2} />
        {errors.surname && <div data-testid={TEST_IDS.error2}>error</div>}
      </div>

      <div>
        <div>{state.email}</div>
        <input {...register({ name: 'email', type: 'email' })} data-testid={TEST_IDS.input3} />
        {errors.email && <div data-testid={TEST_IDS.error3}>error</div>}
      </div>
      <button type="submit">button</button>
    </form>
  );
};

export { BaseForm, TEST_IDS };
export type { FormValues };
