import { useContext } from 'react';
import { useStore } from '@tanstack/react-store';

import { DialogProps } from './Dialog';
import { DialogStoreContext } from './DialogProvider.context';
import { DialogManager } from './DialogProvider.store';

export const useDialogManager = (): DialogManager => {
  const context = useContext(DialogStoreContext);
  if (!context) {
    throw new Error('useDialogManager() must be used within a <DialogProvider/>!');
  }
  return context;
};

export const useDialogsState = (): DialogProps[] => {
  const context = useContext(DialogStoreContext);
  if (!context) {
    throw new Error('useDialogsState() must be used within a <DialogProvider/>!');
  }
  return useStore(context.store, (state) => state);
};

/**
 * @deprecated
 */
export const useDialogProvider: () => DialogManager = useDialogManager;
