import {
  CSSProperties,
  ReactNode,
  useId,
} from 'react';
import clsx from 'clsx';

import { ThemeColor } from '../../types';
import { useThemeManager } from '../ThemeProvider';

import styles from './CircularProgress.module.scss';

export interface CircularProgressProps {
  value: number;
  trackWidth?: number;
  color?: ThemeColor;
  size?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const CircularProgress = ({
  value,
  trackWidth = 8,
  color = 'accent',
  size,
  children,
  className,
  style,
}: CircularProgressProps): JSX.Element => {
  const maskId = useId();
  const { theme } = useThemeManager();
  const fillColor = theme.colors[color].bg;
  const circumference = Math.PI * 50;
  const clampedValue = Math.max(Math.min(value, 1), 0);
  const dasharray = `${clampedValue * circumference} ${circumference}`;
  const thicknessProportion = Math.max(Math.min(trackWidth / (size ?? 100), 100), 0) * 100;
  return (
    <div
      className={clsx(styles.circularProgress, className)}
      style={{ width: size ? `${size}px` : '100%', ...style }}
    >
      <svg
        className={styles.circularProgressSvg}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={maskId}>
            <circle cx="50" cy="50" r="50" fill="white" />
            <circle cx="50" cy="50" r={50 - thicknessProportion} fill="black" />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <circle
            cx="50"
            cy="50"
            r="50"
            style={{ fill: 'var(--color-shaded-secondary-bg)' }}
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke={fillColor}
            strokeWidth="50"
            strokeDasharray={dasharray}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.4s ease' }}
          />
        </g>
      </svg>
      {children && (
        <div className={styles.circularProgressChildren}>
          {children}
        </div>
      )}
    </div>
  );
};
