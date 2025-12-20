import { Store } from '@tanstack/store';
import { nanoid } from 'nanoid';

import { DialogProps } from './Dialog';

export const createDialogManager = () => {
  const store = new Store<DialogProps[]>([]);

  const open = (props: Omit<DialogProps, 'id' | 'open' | 'dirty'>): string => {
    const id = nanoid();
    store.setState((state) => [...state, { id, open: false, dirty: false, ...props }]);
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

  const setOpen = (id: string, open: boolean): void => {
    store.setState((state) => {
      const cutoff = id ? state.findIndex((d) => d.id === id) : -1;
      return state.map((d, i) => ({
        ...d,
        open: i >= cutoff ? open : d.open,
      }));
    });
  };

  const setDirty = (id: string, dirty: boolean): void => {
    store.setState((state) => state.map((d) => d.id === id ? {
      ...d,
      dirty,
    } : d));
  };

  const setProps = (id: string, props: Omit<DialogProps, 'id' | 'open' | 'dirty'>): void => {
    store.setState((state) => state.map((d) => d.id === id ? {
      ...d,
      ...props,
    } : d));
  };

  return {
    close,
    open,
    remove,
    setDirty,
    setOpen,
    setProps,
    store,
  };
};

export type DialogStore = ReturnType<typeof createDialogManager>;
