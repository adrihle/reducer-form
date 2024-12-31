import { render, RenderResult, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BaseForm, FormValues, TEST_IDS } from '../examples/basic';
import { entries } from '../src/utils';

const onSubmit = jest.fn();

const INPUT_VALUES_MAP = {
  [TEST_IDS.input1]: 'something',
  [TEST_IDS.input2]: 'something',
  [TEST_IDS.input3]: 'email@email.com',
};

describe('submission', () => {
  let container: RenderResult;
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  })

  beforeEach(() => {
    container = render(<BaseForm onSubmit={onSubmit} />)
  })

  afterEach(() => {
    container.unmount();
  })

  it('Should fill fields and submit correctly with state arguments', async () => {
    for (const [input, value] of entries(INPUT_VALUES_MAP)) {
      const inputEl = screen.getByTestId(input);
      expect(inputEl).not.toBeNull();

      await user.clear(inputEl);
      await user.type(inputEl, value);
    }

    const button = screen.getByRole('button');
    expect(button).not.toBeNull();

    await user.click(button);

    expect(onSubmit).toHaveBeenCalledWith<[FormValues]>({
      name: INPUT_VALUES_MAP[TEST_IDS.input1],
      surname: INPUT_VALUES_MAP[TEST_IDS.input2],
      email: INPUT_VALUES_MAP[TEST_IDS.input3],
    });
  });
});
