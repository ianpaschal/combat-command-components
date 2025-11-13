import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@base-ui-components/react/dialog';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { AppLogo } from '../../../AppLogo';
import { useTheme } from '../../../ThemeProvider';
import { Route, SecondaryRoute } from '../../AppNavigation.types';
import Styled from './MobileNavigation.styles';

import sharedStyles from '../../AppNavigation.module.scss';
import styles from './MobileNavigation.module.scss';

interface MobileNavigationProps {
  routes: Route[];
  secondaryRoutes?: SecondaryRoute[];
}

export const MobileNavigation = ({
  routes,
  secondaryRoutes = [],
}: MobileNavigationProps): JSX.Element => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Styled.Trigger>
        <Menu />
      </Styled.Trigger>
      <Dialog.Portal>
        <Styled.Backdrop theme={theme} />
        <Dialog.Popup className={styles.MobileNavigation_Drawer}>
          <div className={styles.MobileNavigation_Header}>
            <AppLogo className={styles.MobileNavigation_Header_Logo} />
            <Dialog.Close className={styles.MobileNavigation_Header_Close}>
              <X />
            </Dialog.Close>
          </div>
          <nav className={styles.MobileNavigation_RoutesList}>
            {routes.map((route) => (
              <div key={route.path}>
                <Link to={route.path} className={clsx(sharedStyles.Link, styles.MobileNavigation_PrimaryRoute)}>
                  {route.title}
                </Link>
                {route.children && route.children.length > 0 && (
                  <div className={clsx(sharedStyles.ChildRoutes, styles.MobileNavigation_ChildRoutes)}>
                    {route.children.map((childRoute) => (
                      <Link key={childRoute.path} to={childRoute.path} className={sharedStyles.Link}>
                        {childRoute.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {secondaryRoutes.map((route) => (
              <Link key={route.path} to={route.path} className={clsx(sharedStyles.Link, styles.MobileNavigation_PrimaryRoute)}>
                {route.icon}
                {route.title}
              </Link>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
