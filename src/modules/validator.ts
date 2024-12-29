import { entries } from '../utils';

type ValidationType = 'email' | 'mobile';

type Validation = {
  required?: boolean;
  type?: ValidationType;
  pattern?: RegExp;
  value?: string;
};

type Error = {
  required?: boolean;
  type?: boolean;
  pattern?: boolean;
};

type ValidationMap<T> = Record<keyof T, Validation>;
type ErrorMap<T> = Record<keyof T, Error>;

const validateRequired = (value?: Validation['value']) => {
  if (!value) return { required: true };
};

const TYPE_MAP: Record<ValidationType, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^(6|7|8|9)\d{8}$/,
};

const validateType = (type: ValidationType, value: Validation['value'] = '') => {
  const isValid = TYPE_MAP[type].test(value);
  if (isValid) return;
  return { type: true };
};

const validatePattern = (pattern: RegExp, value: Validation['value']) => {
  if (!value || !(pattern instanceof RegExp)) return;
  const isValid = pattern.test(value);
  if (isValid) return;
  return { pattern: true };
};

const validator = <T>(map: ValidationMap<T>) => {
  return entries(map).reduce((acc, [field, validation]) => {
    const { required, type, pattern, value } = validation;

    const errorRequired = required && validateRequired(value);
    const errorType = type && validateType(type, value);
    const errorPattern = pattern && validatePattern(pattern, value);
    const isError = errorRequired || errorType || errorPattern;

    return {
      ...acc,
      ...(isError && {
        [field]: {
          ...(errorRequired && errorRequired),
          ...(errorType && errorType),
          ...(errorPattern && errorPattern),
        }
      })
    };
  }, {} as ErrorMap<ValidationMap<T>>);
};

export { validator };
export type { ValidationMap, ErrorMap };
