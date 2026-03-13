import { ReactElement, useState } from 'react';
import { Accordion } from '@base-ui/react/accordion';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { MobileRoute } from '../MobileRoute';

import styles from './MobileRouteList.module.scss';

export interface MobileRouteListProps {
  className?: string;
  routes: Route[];
}

export const MobileRouteList = ({
  className,
  routes,
}: MobileRouteListProps): ReactElement => {
  const { location } = useNavigationContext();
  const [openItems, setOpenItems] = useState(() => routes.filter((route) => (
    location.startsWith(route.path + '/')
  )).map((route) => route.path));
  return (
    <Accordion.Root className={clsx(styles.mobileRouteList, className)} value={openItems} onValueChange={setOpenItems}>
      {routes.map((route) => route.children?.length ? (
        <Accordion.Item className={styles.mobileRouteListItem} key={route.path} value={route.path}>
          <Accordion.Header className={styles.mobileRouteListItemHeader}>
            <MobileRoute
              route={route}
              childActive={location.startsWith(route.path + '/') && !openItems.includes(route.path)}
            />
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
            <MobileRouteList routes={route.children} />
          </Accordion.Panel>
        </Accordion.Item>
      ) : (
        <MobileRoute route={route} />
      ))}
    </Accordion.Root>
  );
};
