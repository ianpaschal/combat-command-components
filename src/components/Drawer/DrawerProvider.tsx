import { ReactElement,ReactNode } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider = ({
  children,
}: DrawerProviderProps): ReactElement => (
  <BaseDrawer.Provider>
    {children}
  </BaseDrawer.Provider>
);
