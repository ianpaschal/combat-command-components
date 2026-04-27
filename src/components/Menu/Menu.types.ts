import { ReactElement } from 'react';

import { ElementIntent } from '../../types';

export type Action = {
  handler: (id?: string) => void;
  label: string;
  icon?: JSX.Element;
  intent?: ElementIntent;
};

export type SingleMenuItem = Action | ReactElement;
export type MenuItem = SingleMenuItem | MenuGroup ;

export type MenuGroup = {
  title?: string;
  items: SingleMenuItem[];
};

export interface MenuDisplayProps {
  children: ReactElement; // FIXME: Should be a button.
  groups: MenuGroup[];
  hasIcons?: boolean;
  align?: 'start' | 'center' | 'end';
}

export const isGroup = (item: MenuItem): item is MenuGroup => 'items' in item;
