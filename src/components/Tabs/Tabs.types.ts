import { ReactElement, ReactNode } from 'react';

export type Tab = {
  content: ReactNode;
  value: string;
  title?: string;
  icon?: ReactElement;
};
