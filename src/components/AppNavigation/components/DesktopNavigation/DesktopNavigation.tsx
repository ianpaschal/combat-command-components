import { NavigationMenu } from '@base-ui/react/navigation-menu';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { useAppNavigate } from '../../AppNavigation.hooks';
import { Route, SecondaryRoute } from '../../AppNavigation.types';

import styles from './DesktopNavigation.module.scss';

const linkClassName = clsx(getStyleClassNames({
  variant: 'ghost',
  corners: 'normal',
  size: 'normal',
}), styles.desktopNavigationPrimaryRoute);

const popupClassName = clsx(
  getStyleClassNames({ variant: 'passive', corners: 'normal', border: true }),
  styles.desktopNavigationPopup,
);

interface NavigationProps {
  onNavigate: (path: string) => void;
  routes: Route[];
  secondaryRoutes?: SecondaryRoute[];
}

interface NavMenuProps {
  routes: Route[];
  navigate: (path: string) => void;
  nested?: boolean;
}

const isRouteActive = (location: string, path: string) =>
  location === path || location.startsWith(path + '/');

const NavMenu = ({ routes, navigate, nested = false }: NavMenuProps) => {
  const { location } = useNavigationContext();
  return (
    <NavigationMenu.Root className={nested ? styles.desktopNavigationNestedRoot : styles.desktopNavigation}>
      <NavigationMenu.List className={nested ? styles.desktopNavigationNestedList : styles.desktopNavigationPrimaryRoutes}>
        {routes.map((route) => (
          <NavigationMenu.Item key={route.path}>
            {route.children?.length ? (
              <>
                <NavigationMenu.Trigger
                  data-active={isRouteActive(location, route.path) || undefined}
                  className={clsx(linkClassName, nested && styles.desktopNavigationNestedLink)}
                >
                  {route.icon}
                  {route.title}
                  <NavigationMenu.Icon className={styles.desktopNavigationPrimaryRouteIcon}>
                    {nested ? <ChevronRight /> : <ChevronDown />}
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.desktopNavigationChildRoutes}>
                  <NavMenu routes={route.children} navigate={navigate} nested />
                </NavigationMenu.Content>
              </>
            ) : (
              <NavigationMenu.Link render={(props) => (
                <button
                  {...props}
                  data-active={isRouteActive(location, route.path) || undefined}
                  className={clsx(linkClassName, nested && styles.desktopNavigationNestedLink)}
                  onClick={() => navigate(route.path)}
                >
                  {route.icon}
                  {route.title}
                </button>
              )} />
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.desktopNavigationPositioner}
          {...(nested
            ? { side: 'right' as const, sideOffset: 4, collisionPadding: { top: 5, bottom: 5, left: 5, right: 5 } }
            : { sideOffset: 10, collisionPadding: { top: 5, bottom: 5, left: 20, right: 20 }, collisionAvoidance: { side: 'none' as const } }
          )}
        >
          <NavigationMenu.Popup className={popupClassName}>
            {!nested && (
              <NavigationMenu.Arrow className={styles.desktopNavigationPopupArrow}>
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                  <path
                    d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                    className={styles.desktopNavigationPopupArrowFill}
                  />
                  <path
                    d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                    className={styles.desktopNavigationPopupArrowStroke}
                  />
                </svg>
              </NavigationMenu.Arrow>
            )}
            <NavigationMenu.Viewport className={styles.desktopNavigationViewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};

export const DesktopNavigation = ({
  onNavigate,
  routes,
  secondaryRoutes = [],
}: NavigationProps): JSX.Element => {
  const navigate = useAppNavigate(onNavigate);
  return (
    <div className={styles.desktopNavigationRoutes}>
      <NavMenu routes={routes} navigate={navigate} />
      {secondaryRoutes.length > 0 && (
        <div className={styles.desktopNavigationSecondaryRoutes}>
          {secondaryRoutes.map((route) => (
            <button key={route.path} onClick={() => navigate(route.path)} className={linkClassName}>
              {route.icon && (
                <span className={styles.desktopNavigationPrimaryRouteIcon}>
                  {route.icon}
                </span>
              )}
              {route.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
