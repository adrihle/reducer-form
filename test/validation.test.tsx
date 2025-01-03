import { render, RenderResult, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BaseForm as Form, TEST_IDS } from '../examples/basic';

const onSubmit = jest.fn();

describe('validation', () => {
  describe('on change', () => {
    let container: RenderResult;
    let user: UserEvent;

    beforeAll(() => {
      user = userEvent.setup();
    })

    beforeEach(() => {
      container = render(<Form onSubmit={onSubmit} errorsOnChange />)
    });

    afterEach(() => {
      container.unmount();
    });

    it(`Should sync ${TEST_IDS.error1} on ${TEST_IDS.input1}`, async () => {
      const inputEl = screen.getByTestId(TEST_IDS.input1);
      expect(inputEl).not.toBeNull();

      await user.type(inputEl, 'something');
      await user.clear(inputEl);

      const errorEl = screen.getByTestId(TEST_IDS.error1);
      expect(errorEl).not.toBeNull();

      const button = screen.getByRole('button');
      expect(button).not.toBeNull();

      await user.click(button);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it(`Should sync ${TEST_IDS.error3} on ${TEST_IDS.input3}`, async () => {
      const inputEl = screen.getByTestId(TEST_IDS.input3);
      expect(inputEl).not.toBeNull();

      await user.type(inputEl, 'not an email');

      const errorEl = screen.getByTestId(TEST_IDS.error3);
      expect(errorEl).not.toBeNull();

      const button = screen.getByRole('button');
      expect(button).not.toBeNull();

      await user.click(button);

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('on submit', () => {
    let container: RenderResult;
    let user: UserEvent;

    beforeAll(() => {
      user = userEvent.setup();
    })

    beforeEach(() => {
      container = render(<Form onSubmit={onSubmit} />)
    });

    afterEach(() => {
      container.unmount();
    });

    it('Should not allow submit empty form', async () => {
      const button = screen.getByRole('button');
      expect(button).not.toBeNull();

      const errorPre = screen.queryByTestId(TEST_IDS.error1);
      expect(errorPre).toBeNull();

      await user.click(button);

      const errorPost = screen.getByTestId(TEST_IDS.error1);
      expect(errorPost).not.toBeNull();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('Should fill incorrectly and not allow submit', async () => {
      const input1El = screen.getByTestId(TEST_IDS.input1);
      expect(input1El).not.toBeNull();

      const input3El = screen.getByTestId(TEST_IDS.input3);
      expect(input3El).not.toBeNull();

      await user.type(input3El, 'not an email');

      const button = screen.getByRole('button');
      expect(button).not.toBeNull();

      await user.click(button);

      const error1El = screen.getByTestId(TEST_IDS.error1);
      expect(error1El).not.toBeNull();

      const error3El = screen.getByTestId(TEST_IDS.error3);
      expect(error3El).not.toBeNull();

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
})
