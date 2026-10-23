import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getCalculatorCaretProps } from './getCalculatorCaretProps';

const createInput = (
  value: string,
  start: number,
  end: number = start,
): HTMLInputElement => {
  const input = document.createElement('input');
  input.value = value;
  input.setSelectionRange(start, end);
  return input;
};

const createMouseEvent = (
  input: HTMLInputElement,
): MouseEvent<HTMLInputElement> => ({
  currentTarget: input,
} as unknown as MouseEvent<HTMLInputElement>);

const createFocusEvent = (
  input: HTMLInputElement,
): FocusEvent<HTMLInputElement> => ({
  currentTarget: input,
} as unknown as FocusEvent<HTMLInputElement>);

const createKeyboardEvent = (
  input: HTMLInputElement,
  key: string,
  modifiers: { altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {},
): KeyboardEvent<HTMLInputElement> => (
  {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    ...modifiers,
    currentTarget: input,
    key,
  } as unknown as KeyboardEvent<HTMLInputElement>
);

describe('getCalculatorCaretProps', () => {
  describe('onClick', () => {
    it('should move the caret to the end.', () => {
      const input = createInput('12345', 1);
      getCalculatorCaretProps({}).onClick?.(createMouseEvent(input));
      expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);
    });
    it('should leave a selected range alone.', () => {
      const input = createInput('12345', 0, 5);
      getCalculatorCaretProps({}).onClick?.(createMouseEvent(input));
      expect([input.selectionStart, input.selectionEnd]).toEqual([0, 5]);
    });
    it('should call the input\'s own handler first.', () => {
      const input = createInput('12345', 1);
      const onClick = vi.fn(() => expect(input.selectionStart).toBe(1));
      getCalculatorCaretProps({ onClick }).onClick?.(createMouseEvent(input));
      expect(onClick).toHaveBeenCalledOnce();
      expect(input.selectionStart).toBe(5);
    });
  });

  describe('onFocus', () => {
    it('should move the caret to the end.', () => {
      const input = createInput('12345', 2);
      getCalculatorCaretProps({}).onFocus?.(createFocusEvent(input));
      expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);
    });
    it('should leave a selected range alone.', () => {
      const input = createInput('12345', 1, 3);
      getCalculatorCaretProps({}).onFocus?.(createFocusEvent(input));
      expect([input.selectionStart, input.selectionEnd]).toEqual([1, 3]);
    });
    it('should call the input\'s own handler first.', () => {
      const input = createInput('12345', 2);
      const onFocus = vi.fn(() => expect(input.selectionStart).toBe(2));
      getCalculatorCaretProps({ onFocus }).onFocus?.(createFocusEvent(input));
      expect(onFocus).toHaveBeenCalledOnce();
      expect(input.selectionStart).toBe(5);
    });
  });

  describe('onKeyDown', () => {
    it('should move the caret to the end before a digit is typed.', () => {
      const input = createInput('12345', 0);
      getCalculatorCaretProps({}).onKeyDown?.(createKeyboardEvent(input, '7'));
      expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);
    });
    it('should leave a selected range alone.', () => {
      const input = createInput('12345', 0, 5);
      getCalculatorCaretProps({}).onKeyDown?.(createKeyboardEvent(input, '7'));
      expect([input.selectionStart, input.selectionEnd]).toEqual([0, 5]);
    });
    it('should not move the caret for keys which are not digits.', () => {
      const input = createInput('12345', 0);
      const { onKeyDown } = getCalculatorCaretProps({});
      ['Home', 'ArrowLeft', 'Backspace', 'a', '10'].forEach((key) => {
        onKeyDown?.(createKeyboardEvent(input, key));
      });
      expect(input.selectionStart).toBe(0);
    });
    it('should not move the caret when a modifier key is held.', () => {
      const input = createInput('12345', 0);
      const { onKeyDown } = getCalculatorCaretProps({});
      onKeyDown?.(createKeyboardEvent(input, '7', { ctrlKey: true }));
      onKeyDown?.(createKeyboardEvent(input, '7', { metaKey: true }));
      onKeyDown?.(createKeyboardEvent(input, '7', { altKey: true }));
      expect(input.selectionStart).toBe(0);
    });
    it('should call the input\'s own handler first.', () => {
      const input = createInput('12345', 0);
      const onKeyDown = vi.fn(() => expect(input.selectionStart).toBe(0));
      getCalculatorCaretProps({ onKeyDown }).onKeyDown?.(createKeyboardEvent(input, '7'));
      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(input.selectionStart).toBe(5);
    });
  });
});
