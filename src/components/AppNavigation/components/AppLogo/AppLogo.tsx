import {
  ButtonHTMLAttributes,
  forwardRef,
  MouseEvent,
} from 'react';
import clsx from 'clsx';

import { useNavigationContext } from '../../AppNavigation.context';
import { LogoRoute } from '../../AppNavigation.types';
import { defaultNavigate } from '../../AppNavigation.utils';

import styles from './AppLogo.module.scss';

export interface AppLogoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'onClick'> {
  className?: string;
  path?: string;
  route?: LogoRoute;
}

export const AppLogo = forwardRef<HTMLButtonElement, AppLogoProps>(({
  children,
  className,
  disabled,
  path,
  route,
  ...props
}, ref) => {
  const { navigate } = useNavigationContext();
  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (route) {
      if (route.target) {
        defaultNavigate(route);
      } else {
        navigate(route.path);
      }
    } else if (path) {
      navigate(path);
    }
  };
  return (
    <button
      ref={ref}
      className={clsx(styles.appLogo, className)}
      onClick={handleClick}
      disabled={disabled ?? (!route && !path)}
      {...props}
    >
      {children}
    </button>
  );
});

AppLogo.displayName = 'AppLogo';
