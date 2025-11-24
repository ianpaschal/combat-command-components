import { createContext, useContext } from 'react';

import { DialogProps } from './Dialog';

export interface DialogStoreContextValue {
  open: (props: Omit<DialogProps, 'id' | 'open'>) => string;
  close: (id?: string) => void;
  remove: (id?: string) => void;
}

export const DialogContext = createContext<DialogStoreContextValue | null>(null);

export const useDialogProvider = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogs() must be used within a <DialogProvider/>!');
  }
  return context;
};
