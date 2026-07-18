import { ReactNode } from 'react';

export type AccordionValue = string | number;

export interface AccordionItemState {
  open: boolean;
}

export interface AccordionItem {
  children?: AccordionItem[];
  content?: ReactNode;
  label: ReactNode | ((state: AccordionItemState) => ReactNode);
  value: AccordionValue;
}
