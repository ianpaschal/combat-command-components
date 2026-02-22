import { ReactNode } from 'react';
import { DrawerPreview as BaseDrawer } from '@base-ui/react/drawer';

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider = ({ children }: DrawerProviderProps): JSX.Element => (
  <BaseDrawer.Provider>{children}</BaseDrawer.Provider>
);
