import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { AppLogo } from '../AppLogo';
import { Route } from './AppNavigation.types';

import styles from './AppNavigation.module.scss';

export interface AppNavigationProps {
  className?: string;
  mobile?: boolean;
  routes: Route[];
  secondaryControls?: ReactElement;
}

export const AppNavigation = ({
  className,
  mobile = false,
  routes,
  secondaryControls,
}: AppNavigationProps): JSX.Element => createPortal((
  <div className={clsx(styles.AppNavigation, className)} data-layout={mobile ? 'mobile' : 'desktop'}>
    <AppLogo className={styles.AppNavigation_Logo} />
    <div className={styles.AppNavigation_Navigation}>
      {mobile ? (
        <MobileNavigation routes={routes} />
      ) : (
        <DesktopNavigation routes={routes} />
      )}
    </div>
    {secondaryControls && (
      <div className={styles.AppNavigation_SecondaryControls}>
        {secondaryControls}
      </div>
    )}
  </div>
), document.body);
