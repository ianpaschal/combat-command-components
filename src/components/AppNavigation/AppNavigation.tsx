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
import { LogoRoute, Route } from './AppNavigation.types';

import styles from './AppNavigation.module.scss';

export interface AppNavigationProps {
  name?: string;
  className?: string;
  glass?: boolean;
  logoPath?: string;
  logoRoute?: LogoRoute;
  location: string;
  logo?: ReactNode;
  maxWidth?: number | string;
  mobile?: boolean;
  onNavigate: (path: string) => void;
  portalTarget?: Element;
  routes: Route[];
  secondaryControls?: ReactElement | ReactElement[];
  secondaryRoutes?: Route[];
}

export const AppNavigation = ({
  name,
  className,
  glass = false,
  logoPath,
  logoRoute,
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
    onNavigate(path);
    setState(null); // Close all navigation accordions, menus, etc.
  }, [onNavigate]);
  return createPortal((
    <div className={clsx(styles.appNavigation, ...(glass ? [] : getStyleClassNames({
      variant: 'surface',
      border: 'bottom',
    })), className)}>
      {glass && (
        <div className={clsx(styles.appNavigationGlass, ...getStyleClassNames({
          variant: 'surface',
          border: 'bottom',
          glass,
        }))} />
      )}
      <div className={styles.appNavigationContent} style={{ maxWidth }} data-layout={mobile ? 'mobile' : 'desktop'}>
        <NavigationProvider value={{ navigate, location, state, setState }}>
          <AppLogo className={styles.appNavigationLogo} name={name} path={logoPath} route={logoRoute}>
            {logo}
          </AppLogo>
          <div className={styles.appNavigationNavigation}>
            {mobile ? (
              <MobileNavigation name={name} logo={logo} logoPath={logoPath} logoRoute={logoRoute} routes={routes} secondaryRoutes={secondaryRoutes} />
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
