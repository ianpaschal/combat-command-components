import { ReactElement } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import clsx from 'clsx';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';

import styles from './MobileRoute.module.scss';

export interface MobileRouteProps {
  route: Route;
  childActive?: boolean;
}

export const MobileRoute = ({
  route,
  childActive,
}: MobileRouteProps): ReactElement => {
  const { navigate, location } = useNavigationContext();
  const active = location === route.path || !!childActive;
  // || location.startsWith(route.path + '/')
  return (
    <Dialog.Close key={route.path} nativeButton={false} render={({ onClick, ...props }) => (
      <button
        {...props}
        onClick={(e) => {
          onClick?.(e);
          navigate(route.path);
        }}
        className={clsx(getStyleClassNames({
          variant: 'ghost',
          size: 'normal',
          corners: 'normal',
        }), styles.mobileRoute)}
      >
        <div className={styles.mobileRouteIndicator} data-active={active} />
        <div className={styles.mobileRouteTitle}>
          {route.icon}
          {route.title}
        </div>
      </button>
    )} />
  );
};
