import { createContext, useContext } from "react";
import { useForm, UseFormParams } from './useForm';

type FormContextType = ReturnType<typeof useForm>;

const FormContext = createContext<FormContextType>({} as FormContextType);

type FormProviderProps<T> = UseFormParams<T> & { children: React.ReactNode };

function FormProvider<T>({ children, ...params }: FormProviderProps<T>) {
  const form = useForm(params);

  return (
    <FormContext.Provider value={{...form}}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const context = useContext(FormContext);
  if (Object.keys(context).length === 0) throw new Error('Should use hook inside provider');
  return context;
};

export { FormProvider, useFormContext };
