import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Hero.module.scss';

export interface HeroProps {
  children: ReactNode;
  className?: string;
  backgroundUrl?: string;
  color?: string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

export const Hero = ({
  children,
  className,
  backgroundUrl,
  color,
  maxWidth,
  minHeight,
  maxHeight,
}: HeroProps): JSX.Element => (
  <div
    className={clsx(styles.hero, className)}
    style={{
      backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
      minHeight,
      maxHeight,
    }}
  >
    <div className={styles.heroContent} style={{ maxWidth, '--hero-color': color } as CSSProperties}>
      {children}
    </div>
  </div>
);
