import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { TabsContext, TabsContextValue } from './Tabs.context';

export const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used inside <TabsProvider>');
  }
  return ctx;
};

export const useTabsQueryParam = (key = 'tab', defaultValue = ''): [string, (v: string) => void] => {
  const [value, setValue] = useState(() => (
    new URLSearchParams(window.location.search).get(key) ?? defaultValue
  ));

  useEffect(() => {
    const handlePop = () => {
      setValue(new URLSearchParams(window.location.search).get(key) ?? defaultValue);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [key, defaultValue]);

  const handleChange = (newValue: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, newValue);
    window.history.replaceState(null, '', url.toString());
    setValue(newValue);
  };

  return [value, handleChange];
};
