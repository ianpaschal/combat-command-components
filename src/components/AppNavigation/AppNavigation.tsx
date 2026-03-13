import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { AppLogo } from '../AppLogo';
import { NavigationProvider } from './AppNavigation.context';
import { useAppNavigate } from './AppNavigation.hooks';
import { Route, SecondaryRoute } from './AppNavigation.types';

import styles from './AppNavigation.module.scss';

export interface AppNavigationProps {
  className?: string;
  homeRoute?: string;
  location: string;
  logo?: ReactElement;
  maxWidth?: number | string;
  mobile?: boolean;
  onNavigate: (path: string) => void;
  portalTarget?: Element;
  routes: Route[];
  secondaryControls?: ReactElement;
  secondaryRoutes?: SecondaryRoute[];
}

export const AppNavigation = ({
  className,
  homeRoute,
  location,
  logo,
  maxWidth = '100vw',
  mobile = false,
  onNavigate,
  portalTarget = document.body,
  routes,
  secondaryControls,
  secondaryRoutes,
}: AppNavigationProps): JSX.Element => {
  const navigate = useAppNavigate(onNavigate);
  return createPortal((
    <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.appNavigation, className)}>
      <div className={styles.appNavigationContent} style={{ maxWidth }} data-layout={mobile ? 'mobile' : 'desktop'}>
        <NavigationProvider value={{ navigate, location }}>
          <div className={styles.appNavigationLogo}>
            {logo ?? <AppLogo onClick={homeRoute ? () => navigate(homeRoute) : undefined} />}
          </div>
          <div className={styles.appNavigationNavigation}>
            {mobile ? (
              <MobileNavigation routes={routes} secondaryRoutes={secondaryRoutes} onNavigate={onNavigate} homeRoute={homeRoute} />
            ) : (
              <DesktopNavigation routes={routes} secondaryRoutes={secondaryRoutes} onNavigate={onNavigate} />
            )}
          </div>
          {secondaryControls && (
            <div className={styles.appNavigationSecondaryControls}>
              {secondaryControls}
            </div>
          )}
        </NavigationProvider>
      </div>
    </div>
  ), portalTarget);
};
