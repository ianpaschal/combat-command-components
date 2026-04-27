import { ReactElement } from 'react';
import { Menu as Base } from '@base-ui/react/menu';

import { isReactElement, sx } from '../../../../utils';
import { MenuDisplayProps } from '../../Menu.types';
import { MenuArrow } from '../Arrow/Arrow';

import styles from './DesktopMenu.module.scss';

export const DesktopMenu = ({
  children,
  groups,
  hasIcons = false,
  align,
}: MenuDisplayProps): ReactElement => (
  <Base.Root>
    <Base.Trigger render={children} />
    <Base.Portal>
      <Base.Positioner sideOffset={8} align={align}>
        <Base.Popup className={sx({
          variant: 'surface',
          corners: 'normal',
          elevation: 5,
        }, styles.desktopMenuPopup)}
        >
          <MenuArrow />
          <div className={styles.desktopMenuGroups}>
            {groups.map((group, i) => (
              <Base.Group
                key={`group_${i}`}
                className={styles.desktopMenuGroup}
              >
                {group.title && (
                  <Base.GroupLabel className={styles.desktopMenuGroupLabel} data-has-icons={hasIcons || undefined}>
                    {group.title}
                  </Base.GroupLabel>
                )}
                {group.items.map((item, j) => isReactElement(item) ? (
                  <Base.Item key={`group_${i}_${j}`} className={styles.desktopMenuItemReact}>
                    {item}
                  </Base.Item>
                ) : (
                  <Base.Item
                    key={`group_${i}_${j}`}
                    className={sx({
                      variant: 'ghost',
                      size: 'small',
                      intent: item.intent ?? 'secondary',
                      corners: 'tight',
                    }, styles.desktopMenuItem)}
                    onClick={() => item.handler()}
                    data-has-icons={hasIcons || undefined}
                  >
                    {item.icon && (
                      <div className={styles.desktopMenuItemIcon}>{item.icon}</div>
                    )}
                    <div className={styles.desktopMenuItemLabel}>
                      {item.label}
                    </div>
                  </Base.Item>
                ))}
              </Base.Group>
            ))}
          </div>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  </Base.Root>
);
