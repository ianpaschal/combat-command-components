import { ReactNode, useMemo } from 'react';

import { DialogStoreContext } from './DialogProvider.context';
import { createDialogManager } from './DialogProvider.store';
import { DialogRenderer } from './DialogRenderer';

export interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({
  children,
}: DialogProviderProps): JSX.Element | null => {
  const manager = useMemo(() => createDialogManager(), []);
  return (
    <DialogStoreContext.Provider value={manager}>
      {children}
      <DialogRenderer />
    </DialogStoreContext.Provider>
  );
};
