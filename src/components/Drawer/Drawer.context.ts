import { createContext } from 'react';

export interface DrawerContext {
  close: () => void;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
}

export const drawerContext = createContext<DrawerContext | null>(null);

export const {
  Provider: DrawerContextProvider,
} = drawerContext;
