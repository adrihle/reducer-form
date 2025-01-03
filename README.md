# `useForm` Hook

## Overview

`useForm` is a lightweight React hook designed to simplify form state management with advanced features like reducers for handling field changes, validation, and custom submission logic. It offers flexibility and scalability for both simple and complex forms. 


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

The following example demonstrates a simple form with the `useForm` hook:
```tsx
import { ObserverReducer, useForm } from '@adrihfly/reducer-form';

type FormValues = {
  name: string;
  surname: string;
  email: string;
};

const BasicForm = () => {

  const initialValues: Partial<FormValues> = {
    name: 'Alice',
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

Use the context API to create reusable form components:

#### Shared components
```tsx
// components.tsx
import { useFormContext, FormProviderProps, FormProvider } from '../src';

// --------- implementation components
function Input<T>({ name }: { name: keyof T }) {
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

#### Implementation
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

`useForm(options)`:

The main hook for managing form state.

#### Parameters

	•	initial: (Optional) An object containing the initial form values.
	•	reducers: (Optional) An array of observer reducers that handle field change logic.
	•	errorsOnChange: (Optional) A boolean to validate fields on change. Defaults to false.
	•	onSubmit: A function triggered when the form is submitted.

#### Returns

	•	onsubmit: A function to handle the form submission.
	•	register: A function to register input fields with their properties.
	•	state: The current state of the form.
	•	errors: An object containing validation errors.
	•	set: A function to programmatically set the value of a field.
	•	reset: A function to reset the form to its initial state.


### Contribution

Feel free to open issues or submit pull requests if you’d like to improve the hook or add new features. Contributions are always welcome!


### License

This project is licensed under the MIT License - see the LICENSE file for details.
