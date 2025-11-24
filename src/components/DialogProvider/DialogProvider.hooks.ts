import { useContext, useState } from 'react';
import { nanoid } from 'nanoid';

import { DialogProps } from './Dialog';
import { DialogContext } from './DialogProvider.context';

export const useDialogState = () => {
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

  return {
    state,
    open,
    close,
    remove,
  };
};

export const useDialogs = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogs() must be used within a <DialogProvider/>!');
  }
  return context;
};
