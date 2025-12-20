import { createContext } from 'react';

import { DialogStore } from './DialogManager.store';

export const dialogManagerContext = createContext<DialogStore | null>(null);

export const {
  Provider: DialogManagerProvider,
} = dialogManagerContext;
