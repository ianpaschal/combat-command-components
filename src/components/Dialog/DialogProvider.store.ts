import { ReactNode } from 'react';
import { Store } from '@tanstack/store';
import { nanoid } from 'nanoid';

import { ButtonProps } from '../Button';

export type DialogProps = {
  actions?: ButtonProps[];
  content: ReactNode;
  disablePadding?: boolean;
  id: string;
  onCancel?: () => void;
  open: boolean;
  preventCancel?: boolean;
  title: string;
};

export const dialogStore = new Store<DialogProps[]>([]);

export const openDialog = (props: Omit<DialogProps, 'id'|'open'>): string => {
  const id = nanoid();
  dialogStore.setState((state) => [ ...state, { id, open: true, ...props }]);
  return id;
};

export const closeDialog = (id: string): void => {
  dialogStore.setState((state) => {
    const targetIndex = state.findIndex((modal) => modal.id === id);
    return state.map((modal, index) => 
      index >= targetIndex ? { ...modal, open: false } : modal,
    );
  });
};

export const removeDialog = (id: string): void => {
  dialogStore.setState((state) => state.slice(0, state.findIndex((d) => d.id === id)));
};

export const closeAll = (): void => {
  dialogStore.setState((state) => state.map((d) => ({ ...d, open: false })));
};

export const reset = (): void => {
  dialogStore.setState([]);
};
