import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@base-ui/react/dialog';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { AppLogo } from '../../../AppLogo';
import { Button } from '../../../Button';
import { Route, SecondaryRoute } from '../../AppNavigation.types';

import styles from './MobileNavigation.module.scss';

const linkClassName = clsx(getStyleClassNames({
  variant: 'ghost',
  size: 'normal',
  corners: 'normal',
  collapsePadding: true,
}), styles.mobileNavigationPrimaryRoute);

interface MobileNavigationProps {
  routes: Route[];
  secondaryRoutes?: SecondaryRoute[];
}

export const MobileNavigation = ({
  routes,
  secondaryRoutes = [],
}: MobileNavigationProps): JSX.Element => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger render={(props) => (
        <Button {...props} icon={<Menu />} size="large" variant="ghost" rounded />
      )} />
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileNavigationBackdrop} />
        <Dialog.Popup className={styles.mobileNavigationDrawer}>
          <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.mobileNavigationHeader)}>
            <AppLogo className={styles.mobileNavigationHeaderLogo} />
            <Dialog.Close render={(props) => (
              <Button {...props} icon={<X />} size="large" variant="ghost" rounded />
            )} />
          </div>
          <nav className={styles.mobileNavigationRoutesList}>
            {routes.map((route) => (
              <Fragment key={route.path}>
                <Dialog.Close nativeButton={false} render={(props) => (
                  <button {...props} onClick={() => navigate(route.path)} className={linkClassName}>
                    {route.icon}
                    {route.title}
                  </button>
                )} />
                {route.children && route.children.length > 0 && (
                  <div className={clsx(styles.mobileNavigationChildRoutes)}>
                    {route.children.map((childRoute) => (
                      <Dialog.Close key={childRoute.path} nativeButton={false} render={(props) => (
                        <button
                          {...props}
                          className={linkClassName}
                          onClick={() => navigate(childRoute.path)}
                        >
                          {childRoute.title}
                        </button>
                      )} />
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
            {secondaryRoutes.map((route) => (
              <Dialog.Close key={route.path} nativeButton={false} render={(props) => (
                <button {...props} onClick={() => navigate(route.path)} className={linkClassName}>
                  {route.icon}
                  {route.title}
                </button>
              )} />
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
