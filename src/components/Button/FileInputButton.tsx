import { ChangeEvent, useRef } from 'react';

import { Button, ButtonProps } from './Button';

export interface FileInputButtonProps extends Omit<ButtonProps, 'onChange' | 'onClick'> {
  accept?: string[];
  onChange?: (files: File[]) => void;
}

export const FileInputButton = ({
  accept = [],
  onChange,
  ...props
}: FileInputButtonProps): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const files = Array.from(event.target.files);
    event.target.value = '';
    onChange?.(files);
  };
  return (
    <>
      <Button {...props} onClick={() => ref.current?.click()} />
      <input
        ref={ref}
        type="file"
        accept={accept.join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
};
