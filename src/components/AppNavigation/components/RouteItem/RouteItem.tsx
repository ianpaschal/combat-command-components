import { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';

import { sx } from '../../../../utils';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';

import styles from './RouteItem.module.scss';

export interface RouteItemProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  primary?: boolean;
  route: Route;
  parentPath: string;
}

export const RouteItem = forwardRef<HTMLAnchorElement, RouteItemProps>(({
  children,
  className,
  primary = false,
  parentPath,
  route,
  ...rest
}, ref) => {
  const { navigate, location } = useNavigationContext();
  const currentPath = location.split('?')[0];
  const routePath = route.path.split('?')[0];

  const childActive = route.children?.length && currentPath.startsWith(routePath + '/');
  const isActive = parentPath.split('?')[0] !== routePath && currentPath === routePath;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();
    navigate(route.path);
  };
  return (
    <a
      ref={ref}
      href={route.path}
      {...rest}
      className={clsx(sx({
        corners: 'normal',
        intent: isActive ? 'primary' : 'secondary',
        size: !primary ? 'normal' : undefined,
        variant: 'ghost',
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
