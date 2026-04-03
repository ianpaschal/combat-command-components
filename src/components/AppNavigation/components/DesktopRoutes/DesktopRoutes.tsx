import { ReactElement } from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { sx } from '../../../../utils';
import { NavigationMenuArrow } from '../../../Menu';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { RouteItem } from '../RouteItem';

import styles from './DesktopRoutes.module.scss';

export interface DesktopRoutesProps {
  className?: string;
  depth?: number;
  path?: string;
  routes: Route[];
}

export const DesktopRoutes = ({
  className,
  depth = 0,
  path = '/',
  routes,
}: DesktopRoutesProps): ReactElement => {
  const { state, setState } = useNavigationContext();
  const handleValueChange = (value: string | null): void => setState([
    ...(state ?? []).slice(0, depth),
    ...(value ? [value] : []),
  ]);
  return (
    <NavigationMenu.Root
      className={clsx(styles.desktopRoutes, className)}
      data-depth={depth}
      value={state?.[depth] ?? null}
      onValueChange={handleValueChange}
    >
      <NavigationMenu.List className={styles.desktopRoutesRoutes} data-depth={depth}>
        {routes.map((route) => (
          <NavigationMenu.Item key={route.path} value={route.path}>
            {route.children?.length ? (
              <>
                <NavigationMenu.Trigger render={(props) => (
                  <RouteItem {...props} route={route} primary={!depth} parentPath={path}>
                    <NavigationMenu.Icon className={styles.desktopRoutesChildrenIcon}>
                      {depth ? <ChevronRight /> : <ChevronDown />}
                    </NavigationMenu.Icon>
                  </RouteItem>
                )} />
                <NavigationMenu.Content className={styles.desktopRoutesChildren}>
                  <DesktopRoutes routes={route.children} depth={depth + 1} path={route.path} />
                </NavigationMenu.Content>
              </>
            ) : (
              <NavigationMenu.Link render={(props) => (
                <RouteItem {...props} route={route} primary={!depth} parentPath={path} />
              )} />
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className={styles.desktopRoutesPositioner}
          {...(depth
            ? { side: 'right' as const, sideOffset: 4, collisionPadding: { top: 5, bottom: 5, left: 5, right: 5 } }
            : { sideOffset: 10, collisionPadding: { top: 5, bottom: 5, left: 20, right: 20 }, collisionAvoidance: { side: 'none' as const } }
          )}
        >
          <NavigationMenu.Popup className={clsx(sx({
            corners: 'normal',
            elevation: 5,
            variant: 'surface',
          }), styles.desktopRoutesPopup)}>
            {!depth && (
              <NavigationMenuArrow />
            )}
            <NavigationMenu.Viewport className={styles.desktopRoutesViewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
