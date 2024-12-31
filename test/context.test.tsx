import { render } from "@testing-library/react";
import { FormProvider, useFormContext } from "../src";

const Input = ({ name }: { name: string }) => {
  const { register } = useFormContext();
  return (
    <input {...register({ name })}/>
  );
};

const Form = () => {
  return (
    <FormProvider>
      <form>
        <Input />
        <Input />
        <Input />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('context', () => {
  it('testing', () => {
    const container = render(<Form />)
    expect(container).not.toBeNull();
  })
})
