import { ReactElement } from 'react';

import { Route } from '../../AppNavigation.types';
import { DesktopRoutes } from '../DesktopRoutes';

import styles from './DesktopNavigation.module.scss';

interface NavigationProps {
  routes: Route[];
  secondaryRoutes?: Route[];
}

export const DesktopNavigation = ({
  routes,
  secondaryRoutes = [],
}: NavigationProps): ReactElement => (
  <div className={styles.desktopNavigation}>
    <DesktopRoutes className={styles.desktopNavigationPrimaryRoutes} routes={routes} />
    <DesktopRoutes className={styles.desktopNavigationSecondaryRoutes} routes={secondaryRoutes} />
  </div>
);
