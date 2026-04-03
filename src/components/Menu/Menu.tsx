import { ReactElement } from 'react';

import { DesktopMenu } from './components/DesktopMenu';
import { MobileMenu } from './components/MobileMenu';
import { isReactElement } from '../../utils';
import { MenuDisplayProps, MenuItem } from './Menu.types';
import { normalizeMenuItems } from './Menu.utils';

export interface MenuProps {
  children: ReactElement; // FIXME: Should be a button.
  items: MenuItem[];
  mobile?: boolean;
  align?: MenuDisplayProps['align'];
}

export const Menu = ({
  children,
  items,
  mobile = false,
  align = 'end',
}: MenuProps): ReactElement | null => {
  const groups = normalizeMenuItems(items);
  const props: MenuDisplayProps = {
    children,
    hasIcons: groups.some((group) => group.items.some((item) => !isReactElement(item) && item?.icon)),
    groups,
    align,
  };
  if (!groups.length) {
    return null;
  }
  return mobile ? (
    <MobileMenu {...props} />
  ) : (
    <DesktopMenu {...props} />
  );
};
