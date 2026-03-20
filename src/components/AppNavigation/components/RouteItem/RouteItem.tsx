import { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';

import styles from './RouteItem.module.scss';

export interface RouteItemProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  primary?: boolean;
  route: Route;
}

export const RouteItem = forwardRef<HTMLAnchorElement, RouteItemProps>(({
  children,
  className,
  primary = false,
  route,
  ...rest
}, ref) => {
  const { navigate, location } = useNavigationContext();
  const isActive = location === route.path;
  const childActive = location.startsWith(route.path + '/');
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();
    navigate(route.path);
  };
  return (
    <a
      ref={ref}
      href={route.path}
      {...rest}
      className={clsx(getStyleClassNames({
        variant: 'ghost',
        size: !primary ? 'normal' : undefined,
        corners: 'normal',
      }), styles.routeItem, className)}
      onClick={handleClick}
      data-primary={primary}
    >
      <div className={styles.routeItemIndicator} data-visible={childActive ? 'child' : isActive} />
      <div className={styles.routeItemContent}>
        {route.icon}
        {route.title}
        {children}
      </div>
    </a>
  );
});

RouteItem.displayName = 'RouteItem';
