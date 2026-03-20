import {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { useNavigationContext } from '../../AppNavigation.context';

import styles from './AppLogo.module.scss';

export interface AppLogoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'onClick'> {
  className?: string;
  path?: string;
}

export const AppLogo = ({
  children,
  className,
  disabled,
  path,
  ...props
}: AppLogoProps): ReactElement => {
  const { navigate } = useNavigationContext();
  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (path) {
      navigate(path);
    }
  };
  return (
    <button
      className={clsx(styles.appLogo, className)}
      onClick={handleClick}
      disabled={disabled ?? !path}
      {...props}
    >
      {children}
    </button>
  );
};
