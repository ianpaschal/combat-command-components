import { useContext } from 'react';

import { DialogContext, dialogContext } from './Dialog.context';

export const useDialog = (): DialogContext => {
  const context = useContext(dialogContext);
  if (!context) {
    throw new Error('useDialog() must be used within a <Dialog/>!');
  }
  return context;
};
