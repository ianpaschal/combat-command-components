import { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Card.module.scss';

export interface CardProps {
  children: ReactNode;
  className?: string;
  disablePadding?: boolean;
}

export const Card = ({
  children,
  className,
  disablePadding = false,
}: CardProps): JSX.Element => (
  <div
    className={clsx(styles.card, className)}
    data-disable-padding={disablePadding || undefined}
  >
    {children}
  </div>
);
