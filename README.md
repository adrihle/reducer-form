# `useForm` Hook

## Overview

`useForm` 


## Installation

You can install the package via npm:

```bash
npm install @adrihfly/reducer-form
```

Or via yarn:

```bash
yarn add @adrihfly/reducer-form
```

## Usage

### Basic Example

```tsx
import { ObserverReducer, useForm } from '@adrihfly/reducer-form';

type FormValues = {
  name: string;
  surname: string;
  email: string;
};

const BasicForm = () => {

  const initialValues: Partial<FormValues> = {
    name: 'john',
  };

  const reducer: ObserverReducer<FormValues> = (state, action) => {
    // do any action here on field modification
    return {
      ...state,
      [action.name]: action.value,
    };
  };

  const onSubmit = (submitValues: FormValues) => {
    // do any action here on submit
    console.log(submitValues);
  };

  const { onsubmit, register, state, errors } = useForm<FormValues>({
    initial: initialValues,
    reducers: [reducer],
    errorsOnChange,
    onSubmit,
  });

  return (
    <form onSubmit={onsubmit}>
      <div>
        <div>{state.name}</div>
        <input {...register({ name: 'name', required: true })} data-testid={TEST_IDS.input1} />
        {errors.name && <div>error</div>}
      </div>

      <div>
        <div>{state.surname}</div>
        <input {...register({ name: 'surname', required: true })} data-testid={TEST_IDS.input2} />
        {errors.surname && <div>error</div>}
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
```

### Context Example

You can design your own pattern for reuse components using form context
```tsx
// components.tsx
import { useFormContext, FormProviderProps, FormProvider } from '../src';

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

function Form<T>({ children, ...form }: FormProviderProps<T>) {
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

export { Form, Input, Select };
```

And then implement in the codebase
```tsx
// form.tsx
import { useForm } from '@adrihfly/reducer-form';
import { Form, Input, Select } from './components';

type FormParams = {
  name: string;
  surname: string;
  option: string;
};

const ContextForm = () => {
  const onSubmit = (submitValues: FormValues) => {
    // do any action here on submit
    console.log(submitValues);
  };

  const reducer: ObserverReducer<FormParams> = (state, action) => {
    // do any action on field modification
    return { ...state, [action.name]: action.value };
  };

  const form = useForm<FormParams>({
    initial: { name: 'Alice' },
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
```

## Hook API

TOOL(options):

#### Parameters:


#### Returns: An object containing:


### Contribution

Feel free to open issues or submit pull requests if you’d like to improve the hook or add new features. Contributions are always welcome!


### License

This project is licensed under the MIT License - see the LICENSE file for details.
