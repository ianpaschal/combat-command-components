import { useContext } from 'react';

import { DrawerContext, drawerContext } from './Drawer.context';

export const useDrawer = (): DrawerContext => {
  const ctx = useContext(drawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within a <Drawer />');
  }
  return ctx;
};
