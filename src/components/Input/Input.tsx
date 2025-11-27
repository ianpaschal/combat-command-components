import { ComponentProps, ReactElement } from 'react';
import { Input as BaseInput } from '@base-ui-components/react/input';
import clsx from 'clsx';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Input.module.scss';

export interface InputProps extends ComponentProps<typeof BaseInput> {
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
}

export const Input = ({
  className,
  icon,
  iconPosition = 'start',
  ...restProps
}: InputProps): JSX.Element => (
  <BaseInput
    className={clsx(getStyleClassNames({
      variant: 'outlined',
      size: 'normal',
      corners: 'normal',
    }), styles.input, className)}
    data-icon-position={icon ? iconPosition : undefined}
    {...restProps}
  >
    {icon}
  </BaseInput>
);
