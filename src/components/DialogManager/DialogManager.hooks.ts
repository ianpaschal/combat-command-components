import { useContext } from 'react';
import { useStore } from '@tanstack/react-store';

import { DialogProps } from './Dialog';
import { dialogManagerContext } from './DialogManager.context';
import { DialogStore } from './DialogManager.store';

export const useDialogManager = (): DialogStore => {
  const context = useContext(dialogManagerContext);
  if (!context) {
    throw new Error('useDialogManager() must be used within a <DialogProvider/>!');
  }
  return context;
};

export const useDialogsState = (): DialogProps[] => {
  const context = useContext(dialogManagerContext);
  if (!context) {
    throw new Error('useDialogsState() must be used within a <DialogProvider/>!');
  }
  return useStore(context.store);
};

/**
 * @deprecated
 */
export const useDialogProvider: () => DialogStore = useDialogManager;
