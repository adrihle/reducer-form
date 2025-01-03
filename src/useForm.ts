/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReducer, useRef, useState } from "react";
import { validator, ErrorMap, ValidationMap } from './modules';
import { entries } from './utils';

type ActionPayload<T> = { name: keyof T; value: T[keyof T]; };

type Action<T> =
  | { type: 'FIELD_CHANGE' } & ActionPayload<T>
  | { type: 'SUBMIT' }
  | { type: 'RESET' };

type InternalState = { submitted: boolean };
type State<T> = T & InternalState;

type RegisterParams<T> = {
  name: keyof T;
  required?: boolean;
  type?: 'email';
};

type Fields<T> = Record<RegisterParams<T>['name'], Omit<RegisterParams<T>, 'name'>>;
type InputAttributes = React.InputHTMLAttributes<HTMLElement> & { ref: React.Ref<any> };

type Reducer<T> = (state: State<T>, action: Action<T>) => State<T>;
type ObserverReducer<T> = (state: State<T>, action: ActionPayload<T>) => State<T>;

type UseFormParams<T> = {
  initial?: Partial<T>;
  reducers?: ObserverReducer<T>[];
  errorsOnChange?: boolean;
  onSubmit: ((formValues: Partial<T>) => void) | ((formValues: Partial<T>) => Promise<void>);
};

const createValidationMap = <T>({ fields, state }: { fields: Fields<T>, state: State<T> }) => {
  return entries(fields).reduce((acc, [field, validation]) => {
    return { ...acc, [field]: { ...validation, value: state[field] } };
  }, {} as ValidationMap<T>);
};

const applyReducers = <T>(reducers: ObserverReducer<T>[] = []): Reducer<T> => (state, action) => {
  switch (action.type) {
    case 'FIELD_CHANGE':
      return {
        ...state,
        [action.name]: action.value,
        ...(reducers.reduce((acc, reducer) => {
          const reducerState = Object.keys(acc).length ? acc : state;
          return {
            ...acc,
            ...reducer(reducerState, action),
          };
        }, {} as State<T>)),
      };
    case 'SUBMIT':
      return {
        ...state,
        submitted: true,
      }
    case 'RESET':
      return {
        ...{} as State<T>,
        submitted: false,
      }
    default:
      return state;
  }
};

function useForm<T>({ initial, errorsOnChange = false, reducers = [], onSubmit }: UseFormParams<T>) {
  const initialState = { ...initial, submitted: false } as State<T>;
  const [state, dispatch] = useReducer(applyReducers(reducers), initialState);
  const [errors, setErrors] = useState({} as ErrorMap<T>);
  const fields = useRef({} as Fields<T>).current;
  const refs = useRef({} as Record<keyof T, HTMLElement>).current;

  const handleValidation = (current?: State<T>) => {
    const map = createValidationMap({ fields, state: current ? current : state });
    const errs = validator(map);
    if (Object.keys(errs).length) setErrors(errs);
    else setErrors({} as ErrorMap<T>);
    return Object.keys(errs).length === 0;
  };

  const onchange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const name = e.target.name as keyof T;
    const value = e.target.value as T[keyof T];

    dispatch({ type: 'FIELD_CHANGE', name, value });
    if(errorsOnChange) handleValidation({ ...state, [name]: value });
  };

  const register = (field: RegisterParams<T>): InputAttributes => {
    const { name } = field;
    fields[name] = { ...field };
    return {
      name: String(name),
      onChange: onchange,
      ref: (e: any) => { refs[name as keyof typeof refs] = e; },
      value: name in state ? state[name] as string : '',
    };
  };

  const onsubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { submitted, ...formState } = state;

    if (!handleValidation()) return;

    await onSubmit(formState as T)
    dispatch({ type: 'SUBMIT' });
  };

  const set = (name: keyof T, value: T[keyof T]) => {
    dispatch({ type: 'FIELD_CHANGE', name, value });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return { onsubmit, register, state, errors, set, reset };
};

export { useForm };
export type { ObserverReducer, UseFormParams };
