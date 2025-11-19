import { createContext, useContext } from 'react';
import { Store } from '@tanstack/store';

import { DialogProps } from './DialogProvider.store';

export interface DialogStoreContextValue {
  openDialog: (props: Omit<DialogProps, 'id' | 'open'>) => string;
  closeDialog: (id: string) => void;
  removeDialog: (id: string) => void;
  store: Store<DialogProps[]>;
}

export const DialogStoreContext = createContext<DialogStoreContextValue | null>(null);

export const useDialogStore = (): DialogStoreContextValue => {
  const context = useContext(DialogStoreContext);
  if (!context) {
    throw new Error('useDialogStore must be used within a DialogProvider');
  }
  return context;
};
