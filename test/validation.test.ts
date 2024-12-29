import { ErrorMap, ValidationMap, validator } from '../src/modules';

type FormSchema = {};

const VALIDATION_MAP: ValidationMap<FormSchema> = {
  requiredko: {
    required: true,
    value: '',
  },
  requiredok: {
    required: true,
    value: 'finisimo',
  },
  typeemailnovalue: {
    type: 'email',
    value: '',
  },
  typeemailko: {
    type: 'email',
    value: 'laverga@asd',
  },
  typeemailok: {
    type: 'email',
    value: 'laverga@salada.com',
  },
  patternko: {
    pattern: /^(6|7|8|9)\d{8}$/,
    value: 'eldiablo',
  },
  patternok: {
    pattern: /^(6|7|8|9)\d{8}$/,
    value: '675432312',
  },
  patternnovalue: {
    pattern: /^(6|7|8|9)\d{8}$/,
    value: '',
  },
};

const EXPECTED: ErrorMap<FormSchema> = {
  requiredko: {
    required: true,
  },
  typeemailnovalue: {
    type: true,
  },
  typeemailko: {
    type: true,
  },
  patternko: {
    pattern: true,
  },
};

describe('validator', () => {
  it('Should return expected values', () => {
    const result = validator(VALIDATION_MAP);
    expect(result).toBeDefined();
    expect(result).toEqual(EXPECTED);
  })
})

