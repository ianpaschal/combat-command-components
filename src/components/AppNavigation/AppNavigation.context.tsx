import { createContext, useContext } from 'react';

export type AppNavigationContextValue = {
  location: string;
  logoRoute?: string;
  navigate: (path: string) => void;
  setState: (state: string[] | null) => void;
  state: string[] | null;
};

export const navigationContext = createContext<AppNavigationContextValue | null>(null);

export const useNavigationContext = (): AppNavigationContextValue => {
  const ctx = useContext(navigationContext);
  if (!ctx) {
    throw new Error('useNavigationContext() must be used within <NavigationProvider/>!');
  }
  return ctx;
};

export const {
  Provider: NavigationProvider,
} = navigationContext;
