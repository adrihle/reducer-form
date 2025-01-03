import { render, RenderResult, screen } from "@testing-library/react";
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ContextForm, FormParams, TEST_IDS } from '../examples/context';

const observer = jest.fn();
const onSubmit = jest.fn();

describe('context', () => {
  let container: RenderResult;
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  });

  beforeEach(() => {
    container = render(<ContextForm {...{ observer, onSubmit }} />)
    expect(container).not.toBeNull();
  });

  afterEach(() => {
    container.unmount();
  });

  it('Should work correctly using context form', async () => {
    const inputEl = screen.getByTestId(TEST_IDS.name);
    expect(inputEl).not.toBeNull();

    const inputEl2 = screen.getByTestId(TEST_IDS.surname);
    expect(inputEl2).not.toBeNull();

    await user.clear(inputEl);
    await user.type(inputEl, 'macareno');
    await user.type(inputEl2, 'otracosa');

    const selectEl = screen.getByTestId(TEST_IDS.option);
    expect(selectEl).not.toBeNull();

    await user.selectOptions(selectEl, 'op1');

    expect(observer).toHaveBeenCalled();

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledWith<[FormParams]>({ name: 'macareno', surname: 'otracosa', option: 'op1' });
  });
})
