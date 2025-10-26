import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@base-ui-components/react/dialog';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { AppLogo } from '../../../AppLogo';
import { Route } from '../../AppNavigation.types';

import sharedStyles from '../../AppNavigation.module.scss';
import styles from './MobileNavigation.module.scss';

interface MobileNavigationProps {
  routes: Route[];
}

export const MobileNavigation = ({
  routes,
}: MobileNavigationProps): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger className={styles.MobileNavigation_Trigger}>
        <Menu />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.MobileNavigation_Backdrop} />
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
                <Link key={route.path} to={route.path} className={clsx(sharedStyles.Link, styles.MobileNavigation_PrimaryRoute)}>
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
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
