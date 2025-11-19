import { ReactNode, useState } from 'react';
import { nanoid } from 'nanoid';

import { Dialog, DialogProps } from './Dialog';
import { DialogContext } from './DialogProvider.context';

export interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({
  children,
}: DialogProviderProps): JSX.Element | null => {
  const [state, setState] = useState<DialogProps[]>([]);

  const open = (props: Omit<DialogProps, 'id' | 'open'>): string => {
    const id = nanoid();
    setState((prev) => [...prev, { id, open: true, ...props }]);
    return id;
  };

  const close = (id?: string): void => setState((prev) => {
    const i = id ? prev.findIndex((modal) => modal.id === id) : -1;
    return prev.map((modal, index) =>
      index >= i ? { ...modal, open: false } : modal,
    );
  });

  const remove = (id?: string): void => setState((prev) => {
    if (id) {
      return prev.slice(0, state.findIndex((d) => d.id === id));
    }
    return [];
  });

  const [props, ...nested] = state;

  return (
    <DialogContext.Provider value={{ open, close, remove }}>
      {children}
      {props && (
        <Dialog {...props} nested={nested} />
      )}
    </DialogContext.Provider>
  );
};
