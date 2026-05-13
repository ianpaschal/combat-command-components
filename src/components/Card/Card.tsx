import { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';

import { ElementElevation } from '../../types';
import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Card.module.scss';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  disablePadding?: boolean;
  elevation?: ElementElevation;
}

export const Card = ({
  children,
  className,
  disablePadding = false,
  elevation = 1,
  ...props
}: CardProps): JSX.Element => (
  <div
    {...props}
    className={clsx(...getStyleClassNames({
      variant: 'surface',
      elevation,
      border: true,
      corners: 'normal',
    }), styles.card, className)}
    data-disable-padding={disablePadding || undefined}
  >
    {children}
  </div>
);
