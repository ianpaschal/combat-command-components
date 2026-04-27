import { useContext } from 'react';

import { TabsContext, TabsContextValue } from './Tabs.context';

export const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used inside <TabsProvider>');
  }
  return ctx;
};
