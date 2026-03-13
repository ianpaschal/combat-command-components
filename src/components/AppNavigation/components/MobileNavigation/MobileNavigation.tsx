import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { AppLogo } from '../../../AppLogo';
import { Button } from '../../../Button';
import { ScrollArea } from '../../../ScrollArea';
import { useAppNavigate } from '../../AppNavigation.hooks';
import { Route, SecondaryRoute } from '../../AppNavigation.types';
import { MobileRouteList } from '../MobileRouteList/';

import styles from './MobileNavigation.module.scss';

interface MobileNavigationProps {
  homeRoute?: string;
  onNavigate: (path: string) => void;
  routes: Route[];
  secondaryRoutes?: SecondaryRoute[];
}

export const MobileNavigation = ({
  homeRoute,
  onNavigate,
  routes,
  secondaryRoutes = [],
}: MobileNavigationProps): JSX.Element => {
  const navigate = useAppNavigate(onNavigate);
  const [isOpen, setIsOpen] = useState(false);
  const handleClickLogo = (): void => {
    if (homeRoute) {
      navigate(homeRoute);
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger render={(props) => (
        <Button {...props} icon={<Menu />} size="large" variant="ghost" rounded />
      )} />
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileNavigationBackdrop} />
        <Dialog.Popup className={styles.mobileNavigationDrawer}>
          <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.mobileNavigationHeader)}>
            <AppLogo className={styles.mobileNavigationHeaderLogo} onClick={homeRoute ? handleClickLogo : undefined} />
            <Dialog.Close render={(props) => (
              <Button {...props} icon={<X />} size="large" variant="ghost" rounded />
            )} />
          </div>
          <ScrollArea className={styles.mobileNavigationScrollArea}>
            <nav className={styles.mobileNavigationRoutesList}>
              <MobileRouteList routes={routes} />
              <MobileRouteList routes={secondaryRoutes} />
            </nav>
          </ScrollArea>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
