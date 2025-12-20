import { ReactNode, useMemo } from 'react';
import { useStore } from '@tanstack/react-store';

import { Dialog } from './Dialog';
import { DialogManagerProvider } from './DialogManager.context';
import { createDialogManager } from './DialogManager.store';

export interface DialogManagerProps {
  children: ReactNode;
}

export const DialogManager = ({
  children,
}: DialogManagerProps): JSX.Element | null => {
  const manager = useMemo(() => createDialogManager(), []);
  const [props, ...nested] = useStore(manager.store);
  return (
    <DialogManagerProvider value={manager}>
      {children}
      {props && (
        <Dialog {...props} nested={nested} />
      )}
    </DialogManagerProvider>
  );
};
