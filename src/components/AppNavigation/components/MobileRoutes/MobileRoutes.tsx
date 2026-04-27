import { ReactElement } from 'react';
import { Accordion } from '@base-ui/react/accordion';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { RouteItem } from '../RouteItem';

import styles from './MobileRoutes.module.scss';

export interface MobileRoutesProps {
  className?: string;
  depth?: number;
  path?: string;
  routes: Route[];
}

export const MobileRoutes = ({
  className,
  depth = 0,
  path = '/',
  routes,
}: MobileRoutesProps): ReactElement => {
  const { state, setState } = useNavigationContext();
  return (
    <Accordion.Root
      className={clsx(styles.mobileRoutes, className)}
      value={state?.[depth] ? [state[depth]] : []}
      onValueChange={([v]) => setState(v ? [...(state ?? []).slice(0, depth), v] : (state ?? []).slice(0, depth))}
    >
      {routes.map((route) => route.children?.length ? (
        <Accordion.Item className={styles.mobileRoutesItem} key={route.path} value={route.path}>
          <Accordion.Header className={styles.mobileRoutesItemHeader}>
            <RouteItem route={route} parentPath={path} />
            <Accordion.Trigger className={clsx(styles.mobileRoutesItemTrigger, ...getStyleClassNames({
              corners: 'normal',
              size: 'normal',
              square: true,
              variant: 'ghost',
            }))}>
              <ChevronRight className={styles.mobileRoutesItemTriggerChevron} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className={styles.mobileRoutesItemPanel}>
            <MobileRoutes routes={route.children} depth={depth + 1} path={route.path} />
          </Accordion.Panel>
        </Accordion.Item>
      ) : (
        <RouteItem key={route.path} route={route} parentPath={path} />
      ))}
    </Accordion.Root>
  );
};
