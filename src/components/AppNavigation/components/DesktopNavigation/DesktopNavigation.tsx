import { Route } from '../../AppNavigation.types';
import { DesktopRouteList } from '../DesktopRouteList/DesktopRouteList';

import styles from './DesktopNavigation.module.scss';

interface NavigationProps {
  routes: Route[];
  secondaryRoutes?: Route[];
}

export const DesktopNavigation = ({
  routes,
  secondaryRoutes = [],
}: NavigationProps): JSX.Element => (
  <div className={styles.desktopNavigation}>
    <DesktopRouteList className={styles.desktopNavigationPrimaryRoutes} routes={routes} />
    <DesktopRouteList className={styles.desktopNavigationSecondaryRoutes} routes={secondaryRoutes} />
  </div>
);
