import { Store } from '@tanstack/store';
import { nanoid } from 'nanoid';

import { DialogProps } from './Dialog';

export const createDialogManager = () => {
  const store = new Store<DialogProps[]>([]);

  const open = (props: Omit<DialogProps, 'id' | 'open'>): string => {
    const id = nanoid();
    store.setState((state) => [...state, { id, open: true, ...props }]);
    return id;
  };

  const close = (id?: string): void => {
    store.setState((state) => {
      const cutoff = id ? state.findIndex((d) => d.id === id) : -1;
      return state.map((d, i) => i >= cutoff ? { ...d, open: false } : d);
    });
  };

  const remove = (id?: string): void => {
    store.setState((state) => {
      const cutoff = id ? state.findIndex((d) => d.id === id) : 0;
      return state.slice(0, cutoff);
    });
  };

  return {
    store,
    open,
    close,
    remove,
  };
};

export type DialogManager = ReturnType<typeof createDialogManager>;
