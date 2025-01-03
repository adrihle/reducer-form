import { createContext, useContext } from "react";
import { useForm } from './useForm';

type FormContextType<T> = ReturnType<typeof useForm<T>>;

const FormContext = createContext<any>({});

type FormProviderProps<T> = {
  children: React.ReactNode;
} & FormContextType<T>;

function FormProvider<T>({ children, ...form }: FormProviderProps<T>) {
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
};

function useFormContext<T>() {
  const context = useContext<FormContextType<T>>(FormContext);
  if (Object.keys(context).length === 0) throw new Error('Should use hook inside provider');
  return context;
};

export { useFormContext, FormProvider };
export type { FormProviderProps };
