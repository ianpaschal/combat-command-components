import {
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  SyntheticEvent,
} from 'react';

/**
 * Moves the caret of an input which is filled in from the end (calculator
 * style) to the end, since digits are always added there. A selected range is
 * left alone so it can still be replaced.
 *
 * @param e - The event (e.g. click or focus) of the input
 */
const moveCaretToEnd = (
  e: SyntheticEvent<HTMLInputElement>,
): void => {
  const { currentTarget } = e;
  if (currentTarget.selectionStart === currentTarget.selectionEnd) {
    const { length } = currentTarget.value;
    currentTarget.setSelectionRange(length, length);
  }
};

type CaretProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'onClick' | 'onFocus' | 'onKeyDown'>;

/**
 * Gets the handlers which keep the caret of an input which is filled in from
 * the end (calculator style) at the end. This includes just before a digit is
 * typed, in case the caret was moved (e.g. with Home or ArrowLeft). The input's
 * own handlers are called first. Spread them after the other props, or they are
 * replaced.
 *
 * @param props - The input's props (only onClick, onFocus and onKeyDown are read)
 * @returns The click, focus and key down handlers
 */
export const getCalculatorCaretProps = (props: CaretProps): CaretProps => ({
  onClick: (e: MouseEvent<HTMLInputElement>): void => {
    props.onClick?.(e);
    moveCaretToEnd(e);
  },
  onFocus: (e: FocusEvent<HTMLInputElement>): void => {
    props.onFocus?.(e);
    moveCaretToEnd(e);
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>): void => {
    props.onKeyDown?.(e);
    if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      moveCaretToEnd(e);
    }
  },
});
