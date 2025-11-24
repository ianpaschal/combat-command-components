import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { getStyleClassNames } from '../../utils/getStyleClassNames';
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
  <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.appNavigation, className)}>
    <div className={styles.appNavigationContent} style={{ maxWidth }} data-layout={mobile ? 'mobile' : 'desktop'}>
      <div className={styles.appNavigationLogo}>
        {logo ?? <AppLogo />}
      </div>
      <div className={styles.appNavigationNavigation}>
        {mobile ? (
          <MobileNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
        ) : (
          <DesktopNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
        )}
      </div>
      {secondaryControls && (
        <div className={styles.appNavigationSecondaryControls}>
          {secondaryControls}
        </div>
      )}
    </div>
  </div>
), document.body);
