import { ReactElement, ReactNode } from 'react';

type TabBase = {
  content: ReactNode;
  value: string;
};

export type Tab = TabBase & (
  | { title: string; icon?: ReactElement }
  | { icon: ReactElement; title?: string }
);
