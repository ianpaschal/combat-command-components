import { Menu as BaseMenu } from '@base-ui/react/menu';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import clsx from 'clsx';

import styles from './Arrow.module.scss';

const ArrowSVG = (): JSX.Element => (
  <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
    <path
      d="M 0,6 A 6,6 0 0 0 4.5,3.96863 L 8,0 L 11.5,3.96863 A 6,6 0 0 0 16,6 L 16,8 L 0,8 Z"
      style={{ fill: 'var(--color-card-border)' }}
    />
    <path
      d="M 0,7 A 7,7 0 0 0 5.25,4.63006 L 8,1.51186 L 10.75,4.63006 A 7,7 0 0 0 16,7 L 16,8 L 0,8 Z"
      style={{ fill: 'var(--color-card-bg)' }}
    />
  </svg>
);

export const MenuArrow = (): JSX.Element => (
  <BaseMenu.Arrow className={styles.arrow}>
    <ArrowSVG />
  </BaseMenu.Arrow>
);

export const NavigationMenuArrow = (): JSX.Element => (
  <NavigationMenu.Arrow className={clsx(styles.arrow, styles.navigationMenuArrow)}>
    <ArrowSVG />
  </NavigationMenu.Arrow>
);
