import { ReactElement } from 'react';
import { Accordion } from '@base-ui/react/accordion';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { RouteItem } from '../RouteItem';

import styles from './MobileRouteList.module.scss';

export interface MobileRouteListProps {
  className?: string;
  routes: Route[];
  depth?: number;
}

export const MobileRouteList = ({
  className,
  routes,
  depth = 0,
}: MobileRouteListProps): ReactElement => {
  const { state, setState } = useNavigationContext();
  return (
    <Accordion.Root
      className={clsx(styles.mobileRouteList, className)}
      value={state?.[depth] ? [state[depth]] : []}
      onValueChange={([v]) => setState(v ? [...(state ?? []).slice(0, depth), v] : (state ?? []).slice(0, depth))}
    >
      {routes.map((route) => route.children?.length ? (
        <Accordion.Item className={styles.mobileRouteListItem} key={route.path} value={route.path}>
          <Accordion.Header className={styles.mobileRouteListItemHeader}>
            <RouteItem route={route} />
            <Accordion.Trigger className={clsx(styles.mobileRouteListItemTrigger, ...getStyleClassNames({
              corners: 'normal',
              size: 'normal',
              square: true,
              variant: 'ghost',
            }))}>
              <ChevronRight className={styles.mobileRouteListItemTriggerChevron} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className={styles.mobileRouteListItemPanel}>
            <MobileRouteList routes={route.children} depth={depth + 1} />
          </Accordion.Panel>
        </Accordion.Item>
      ) : (
        <RouteItem route={route} />
      ))}
    </Accordion.Root>
  );
};
