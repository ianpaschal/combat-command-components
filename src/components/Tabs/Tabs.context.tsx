import { createContext } from 'react';

import { Tab } from './Tabs.types';

export interface TabsContextValue {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);
