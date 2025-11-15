import { Link, useNavigate } from 'react-router-dom';
import { NavigationMenu } from '@base-ui-components/react/navigation-menu';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

import { Route, SecondaryRoute } from '../../AppNavigation.types';

import sharedStyles from '../../AppNavigation.module.scss';
import styles from './DesktopNavigation.module.scss';

interface NavigationProps {
  routes: Route[];
  secondaryRoutes?: SecondaryRoute[];
}

export const DesktopNavigation = ({
  routes,
  secondaryRoutes = [],
}: NavigationProps): JSX.Element => {
  const navigate = useNavigate();
  return (
    <NavigationMenu.Root className={styles.DesktopNavigation}>
      <div className={styles.DesktopNavigation_Routes}>
        <NavigationMenu.List className={styles.DesktopNavigation_PrimaryRoutes}>
          {routes.map((route) => (
            <NavigationMenu.Item key={route.path}>
              {route.children && route.children.length > 0 ? (
                <>
                  <NavigationMenu.Trigger
                    className={sharedStyles.Link}
                    onClick={() => navigate(route.path)}
                  >
                    {route.title}
                    <NavigationMenu.Icon className={styles.DesktopNavigation_PrimaryRoute_Icon}>
                      <ChevronDown />
                    </NavigationMenu.Icon>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className={clsx(sharedStyles.ChildRoutes, styles.DesktopNavigation_ChildRoutes)}>
                    {route.children.map((childRoute) => (
                      <NavigationMenu.Link key={childRoute.path} render={(props) => (
                        <Link {...props} to={childRoute.path} className={sharedStyles.Link}>
                          {childRoute.title}
                        </Link>
                      )} />
                    ))}
                  </NavigationMenu.Content>
                </>
              ) : (
                <NavigationMenu.Link render={() => (
                  <Link to={route.path} className={sharedStyles.Link}>
                    {route.title}
                  </Link>
                )} />
              )}
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
        {secondaryRoutes.length > 0 && (
          <div className={styles.DesktopNavigation_SecondaryRoutes}>
            {secondaryRoutes.map((route) => (
              <Link key={route.path} to={route.path} className={sharedStyles.Link}>
                {route.icon}
                {route.title}
              </Link>
            ))}
          </div>
        )}
      </div>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.DesktopNavigation_Positioner}
          sideOffset={10}
          collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
          collisionAvoidance={{ side: 'none' }}
        >
          <NavigationMenu.Popup className={styles.DesktopNavigation_Popup}>
            <NavigationMenu.Arrow className={styles.DesktopNavigation_Popup_Arrow}>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                  className={styles.DesktopNavigation_Popup_Arrow_Fill}
                />
                <path
                  d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                  className={styles.DesktopNavigation_Popup_Arrow_Stroke}
                />
              </svg>
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className={styles.DesktopNavigation_Viewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
