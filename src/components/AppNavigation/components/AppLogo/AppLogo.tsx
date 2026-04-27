import {
  ButtonHTMLAttributes,
  forwardRef,
  MouseEvent,
} from 'react';
import clsx from 'clsx';

import { useNavigationContext } from '../../AppNavigation.context';

import styles from './AppLogo.module.scss';

export interface AppLogoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'onClick'> {
  className?: string;
  path?: string;
}

export const AppLogo = forwardRef<HTMLButtonElement, AppLogoProps>(({
  children,
  className,
  disabled,
  path,
  ...props
}, ref) => {
  const { navigate } = useNavigationContext();
  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (path) {
      navigate(path);
    }
  };
  return (
    <button
      ref={ref}
      className={clsx(styles.appLogo, className)}
      onClick={handleClick}
      disabled={disabled ?? !path}
      {...props}
    >
      {children}
    </button>
  );
});

AppLogo.displayName = 'AppLogo';
