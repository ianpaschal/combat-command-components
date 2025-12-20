import { createContext } from 'react';

export type DialogContext = {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
};

export const dialogContext = createContext<DialogContext | null>(null);

export const {
  Provider: DialogContextProvider,
} = dialogContext;
