import { createContext } from 'react';

import { DialogManager } from './DialogProvider.store';

export const DialogStoreContext = createContext<DialogManager | null>(null);
