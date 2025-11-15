import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { AppLogo } from '../AppLogo';
import { Route, SecondaryRoute } from './AppNavigation.types';

import styles from './AppNavigation.module.scss';

export interface AppNavigationProps {
  className?: string;
  logo?: ReactElement;
  maxWidth?: number | string;
  mobile?: boolean;
  routes: Route[];
  secondaryControls?: ReactElement;
  secondaryRoutes?: SecondaryRoute[];
}

export const AppNavigation = ({
  className,
  logo,
  maxWidth = '100vw',
  mobile = false,
  routes,
  secondaryControls,
  secondaryRoutes,
}: AppNavigationProps): JSX.Element => createPortal((
  <div className={clsx(styles.AppNavigation, className)}>
    <div className={styles.AppNavigation_Content} style={{ maxWidth }} data-layout={mobile ? 'mobile' : 'desktop'}>
      <div className={styles.AppNavigation_Logo}>
        {logo ?? <AppLogo />}
      </div>
      <div className={styles.AppNavigation_Navigation}>
        {mobile ? (
          <MobileNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
        ) : (
          <DesktopNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
        )}
      </div>
      {secondaryControls && (
        <div className={styles.AppNavigation_SecondaryControls}>
          {secondaryControls}
        </div>
      )}
    </div>
  </div>
), document.body);
