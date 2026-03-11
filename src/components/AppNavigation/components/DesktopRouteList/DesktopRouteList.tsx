import { ReactElement } from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { RouteItem } from '../RouteItem';

import styles from './DesktopRouteList.module.scss';

const popupClassName = clsx(
  getStyleClassNames({ variant: 'passive', corners: 'normal', border: true }),
  styles.desktopRouteListPopup,
);

export interface DesktopRouteListProps {
  className?: string;
  routes: Route[];
  depth?: number;
}

export const DesktopRouteList = ({
  routes,
  className,
  depth = 0,
}: DesktopRouteListProps): ReactElement => {
  const { state, setState } = useNavigationContext();
  return (
    <NavigationMenu.Root
      className={clsx(depth ? styles.desktopRouteListNestedRoot : styles.desktopRouteList, className)}
      value={state?.[depth] ?? null}
      onValueChange={(v) => setState(v ? [...(state ?? []).slice(0, depth), v] : (state ?? []).slice(0, depth))}
    >
      <NavigationMenu.List className={depth ? styles.desktopRouteListNestedList : styles.desktopRouteListPrimaryRoutes}>
        {routes.map((route) => (
          <NavigationMenu.Item key={route.path} value={route.path}>
            {route.children?.length ? (
              <>
                <NavigationMenu.Trigger
                  render={(props) => (
                    <RouteItem {...props} route={route} primary={!depth}>
                      <NavigationMenu.Icon className={styles.desktopRouteListPrimaryRouteIcon}>
                        {depth ? <ChevronRight /> : <ChevronDown />}
                      </NavigationMenu.Icon>
                    </RouteItem>
                  )}
                />
                <NavigationMenu.Content className={styles.desktopRouteListChildRoutes}>
                  <DesktopRouteList routes={route.children} depth={depth + 1} />
                </NavigationMenu.Content>
              </>
            ) : (
              <NavigationMenu.Link render={(props) => (
                <RouteItem {...props} route={route} primary={!depth} />
              )} />
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.desktopRouteListPositioner}
          {...(depth
            ? { side: 'right' as const, sideOffset: 4, collisionPadding: { top: 5, bottom: 5, left: 5, right: 5 } }
            : { sideOffset: 10, collisionPadding: { top: 5, bottom: 5, left: 20, right: 20 }, collisionAvoidance: { side: 'none' as const } }
          )}
        >
          <NavigationMenu.Popup className={popupClassName}>
            {!depth && (
              <NavigationMenu.Arrow className={styles.desktopRouteListPopupArrow}>
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                  <path
                    d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                    className={styles.desktopRouteListPopupArrowFill}
                  />
                  <path
                    d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                    className={styles.desktopRouteListPopupArrowStroke}
                  />
                </svg>
              </NavigationMenu.Arrow>
            )}
            <NavigationMenu.Viewport className={styles.desktopRouteListViewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
