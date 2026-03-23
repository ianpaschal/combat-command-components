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
import { MobileRoutes } from '../MobileRoutes';

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
        <Button
          {...props}
          aria-label="Open navigation menu"
          icon={<Menu />}
          rounded
          size="large"
          variant="ghost"
        />
      )} />
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileNavigationBackdrop} />
        <Dialog.Popup className={styles.mobileNavigationDrawer}>
          <div className={clsx(getStyleClassNames({ border: 'bottom' }), styles.mobileNavigationHeader)}>
            <AppLogo path={logoPath}>
              {logo}
            </AppLogo>
            <Dialog.Close render={(props) => (
              <Button
                {...props}
                aria-label="Close navigation menu"
                icon={<X />}
                rounded
                size="large"
                variant="ghost"
              />
            )} />
          </div>
          <ScrollArea className={styles.mobileNavigationScrollArea}>
            <nav className={styles.mobileNavigationRoutesList}>
              <MobileRoutes routes={routes} />
              <MobileRoutes routes={secondaryRoutes} />
            </nav>
          </ScrollArea>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
