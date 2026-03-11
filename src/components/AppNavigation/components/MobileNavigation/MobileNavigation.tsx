import { ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { getStyleClassNames } from '../../../../utils/getStyleClassNames';
import { Button } from '../../../Button';
import { ScrollArea } from '../../../ScrollArea';
import { useNavigationContext } from '../../AppNavigation.context';
import { Route } from '../../AppNavigation.types';
import { locationToAncestorPaths } from '../../AppNavigation.utils';
import { AppLogo } from '../AppLogo';
import { MobileRouteList } from '../MobileRouteList/';

import styles from './MobileNavigation.module.scss';

interface MobileNavigationProps {
  logo?: ReactNode;
  logoPath?: string;
  routes: Route[];
  secondaryRoutes?: Route[];
}

export const MobileNavigation = ({
  logo,
  logoPath,
  routes,
  secondaryRoutes = [],
}: MobileNavigationProps): JSX.Element => {
  const { location, state, setState } = useNavigationContext();
  const handleOpenChange = (open: boolean): void => {
    setState(open ? locationToAncestorPaths(location).slice(0, -1) : null);
  };
  return (
    <Dialog.Root open={!!state} onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={(props) => (
        <Button {...props} icon={<Menu />} size="large" variant="ghost" rounded />
      )} />
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileNavigationBackdrop} />
        <Dialog.Popup className={styles.mobileNavigationDrawer}>
          <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.mobileNavigationHeader)}>
            <AppLogo path={logoPath}>
              {logo}
            </AppLogo>
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
