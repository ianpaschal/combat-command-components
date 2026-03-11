import {
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { AppLogo } from './components/AppLogo/AppLogo';
import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { NavigationProvider } from './AppNavigation.context';
import { Route } from './AppNavigation.types';

import styles from './AppNavigation.module.scss';

export interface AppNavigationProps {
  className?: string;
  logoPath?: string;
  location: string;
  logo?: ReactNode;
  maxWidth?: number | string;
  mobile?: boolean;
  onNavigate: (path: string) => void;
  portalTarget?: Element;
  routes: Route[];
  secondaryControls?: ReactElement;
  secondaryRoutes?: Route[];
}

export const AppNavigation = ({
  className,
  logoPath,
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
  const [state, setState] = useState<string[] | null>(null);
  const navigate = useCallback((path: string) => {
    if (path.startsWith('/')) {
      onNavigate(path);
    } else {
      window.open(path, '_blank', 'noopener,noreferrer');
    }
    setState(null); // Close all navigation accordions, menus, etc.
  }, [onNavigate]);
  return createPortal((
    <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.appNavigation, className)}>
      <div className={styles.appNavigationContent} style={{ maxWidth }} data-layout={mobile ? 'mobile' : 'desktop'}>
        <NavigationProvider value={{ navigate, location, state, setState }}>
          <AppLogo className={styles.appNavigationLogo} path={logoPath}>
            {logo}
          </AppLogo>
          <div className={styles.appNavigationNavigation}>
            {mobile ? (
              <MobileNavigation logo={logo} logoPath={logoPath} routes={routes} secondaryRoutes={secondaryRoutes} />
            ) : (
              <DesktopNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
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
