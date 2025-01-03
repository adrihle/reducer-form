import { render, RenderResult, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BaseForm as Form, TEST_IDS } from '../examples/basic';
import { entries } from '../src/utils';

const onSubmit = jest.fn();

const INPUTS_IDS = [TEST_IDS.input1, TEST_IDS.input2, TEST_IDS.input3];

const INPUT_VALUES_MAP = {
  [TEST_IDS.input1]: 'something',
  [TEST_IDS.input2]: 'something',
  [TEST_IDS.input3]: 'email@email.com',
};

describe('synchronization', () => {
  const inputElements = {} as Record<typeof INPUTS_IDS[number], HTMLElement>;
  let container: RenderResult;
  let user: UserEvent;

  beforeEach(() => {
    container = render(<Form onSubmit={onSubmit} />)
    user = userEvent.setup()

    INPUTS_IDS.forEach((input) => {
      const inputElement = screen.getByTestId(input);
      expect(inputElement).not.toBeNull();
      inputElements[input] = inputElement;
    })
  });

  afterEach(() => {
    container.unmount();
  });

  it.each(
    entries(INPUT_VALUES_MAP).map(([input, value]) => ({ input, value }))
  )('Should change the $value correctly from $input', async ({ value, input }) => {
    const inputEl = inputElements[input];
    expect(inputEl).not.toBeNull();

    await user.clear(inputEl);
    await user.type(inputEl, value);

    await waitFor(() => {
      const found = screen.getByText(value);
      expect(found).not.toBeNull();
    });
  });

  it('Should fill fields, validate and allow submit', async () => {
    for (const [input, value] of entries(INPUT_VALUES_MAP)) {
      const inputEl = inputElements[input];
      await user.clear(inputEl);
      await user.type(inputEl, value);
    }

    const button = screen.getByRole('button');
    expect(button).not.toBeNull();

    await user.click(button);
    expect(onSubmit).toHaveBeenCalled();
  });
});
