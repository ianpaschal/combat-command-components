import {
  ReactElement,
  useEffect,
  useState,
} from 'react';
import NumberFlow, { Format } from '@number-flow/react';
import clsx from 'clsx';

import styles from './StatBlock.module.scss';

export interface StatBlockProps {
  className?: string;
  format?: Format;
  label: string;
  suffix?: string;
  value: number;
}

export const StatBlock = ({
  className,
  format,
  label,
  suffix,
  value,
}: StatBlockProps): ReactElement => {

  // NumberFlow only animates changes, so start at 0 to have the first value roll in too.
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formattedValue = `${new Intl.NumberFormat(undefined, format).format(value)}${suffix ?? ''}`;

  return (
    <div className={clsx(styles.statBlock, className)} aria-label={`${label}: ${formattedValue}`} role="img">
      <NumberFlow format={format} suffix={suffix} value={displayValue} />
    </div>
  );
};

StatBlock.displayName = 'StatBlock';
