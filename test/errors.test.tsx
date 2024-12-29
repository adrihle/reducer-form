import { render, RenderResult, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BaseForm as Form, TEST_IDS } from '../examples/basic';
import { entries } from '../src/utils';

const INPUTS_IDS = [TEST_IDS.input1, TEST_IDS.input2, TEST_IDS.input3];
const ERRORS_IDS = [TEST_IDS.errro1, TEST_IDS.errro2, TEST_IDS.errro3];

const WRONG_VALUES_MAP = {
  [TEST_IDS.input1]: '',
  [TEST_IDS.input2]: '',
  [TEST_IDS.input3]: 'not_email',
};

const onSubmit = jest.fn();

describe('errors', () => {
  const inputElements = {} as Record<typeof INPUTS_IDS[number], HTMLElement>;
  let container: RenderResult;
  let user: UserEvent;

  beforeEach(() => {
    container = render(<Form onSubmit={onSubmit} errorsOnChange={true} />)
    user = userEvent.setup()

    INPUTS_IDS.forEach((input) => {
      const inputElement = screen.getByTestId(input);
      expect(inputElement).not.toBeNull();
      inputElements[input] = inputElement;
    });
  });

  afterEach(() => {
    container.unmount();
  });

  it.each(
    entries(WRONG_VALUES_MAP).map(([input, value], i) => ({ input, value, error: ERRORS_IDS[i] }))
  )('Should $input throw errors on change with wrong value: $value', async ({ input, value, error }) => {
    const inputEl = inputElements[input];
    await user.clear(inputEl);
    if (value) await user.type(inputEl, value);

    const button = screen.getByRole('button');
    expect(button).not.toBeNull();

    await user.click(button);

    await waitFor(() => {
      const errorEl = screen.getByTestId(error);
      expect(errorEl).not.toBeNull();
    });
  });
})
