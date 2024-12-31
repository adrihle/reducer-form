import { render, screen, RenderResult } from "@testing-library/react";
import { BaseForm, FormValues, TEST_IDS } from "../examples/basic";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { ObserverReducer } from "../src/useForm";

const onSubmit = jest.fn();
const observerName = jest.fn();
const EMAIL_SYNC = 'email_sync';

const reducer: ObserverReducer<FormValues> = (state, action) => {
  switch (action.name) {
    case 'name':
      observerName(state, action.value);
      return {
        ...state,
        name: action.value,
      };

    case 'surname':
      return {
        ...state,
        surname: action.value,
        email: EMAIL_SYNC,
      };

    default:
      return {
        ...state,
        [action.name]: action.value,
      };
  }
};

describe('observability', () => {
  let container: RenderResult;
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  })

  beforeEach(() => {
    container = render(<BaseForm onSubmit={onSubmit} reducers={[reducer]} />)
  })

  afterEach(() => {
    container.unmount();
  })

  it(`Should observe changes in ${TEST_IDS.input1}`, async () => {
    const inputEl = screen.getByTestId(TEST_IDS.input1);
    expect(inputEl).not.toBeNull();

    await user.type(inputEl, 'something');

    expect(observerName).toHaveBeenCalled();
  })

  it(`Should sync ${TEST_IDS.input3} when ${TEST_IDS.input2} is change`, async () => {
    const input2El = screen.getByTestId(TEST_IDS.input2);
    expect(input2El).not.toBeNull();

    await user.type(input2El, 'testing');

    const input3StateSync = screen.getByText(EMAIL_SYNC);
    expect(input3StateSync).not.toBeNull();
  })
});
