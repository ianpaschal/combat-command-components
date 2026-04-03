import { ReactElement } from 'react';
import { Drawer as Base } from '@base-ui/react/drawer';

import { isReactElement, sx } from '../../../../utils';
import { MenuDisplayProps } from '../../Menu.types';

import styles from './MobileMenu.module.scss';

export const MobileMenu = ({
  children,
  groups,
  hasIcons,
}: MenuDisplayProps): ReactElement => (
  <Base.Root>
    <Base.Trigger render={children} />
    <Base.Portal>
      <Base.Backdrop className={styles.mobileMenuBackdrop} />
      <Base.Viewport className={styles.mobileMenuViewport}>
        <Base.Popup className={styles.mobileMenuPopup}>
          <Base.Content className={styles.mobileMenuGroups}>
            {groups.map((group, i) => (
              <div
                className={sx({ variant: 'surface', border: true, corners: 'wide' }, styles.mobileMenuGroup)}
                aria-label={group.title}
              >
                {group.title && (
                  <div className={styles.mobileMenuGroupLabel}>
                    {group.title}
                  </div>
                )}
                {group.items.map((item, j) => isReactElement(item) ? (
                  <Base.Close key={`group_${i}_${j}`}>
                    {item}
                  </Base.Close>
                ) : (
                  <Base.Close
                    key={`group_${i}_${j}`}
                    className={sx({
                      variant: 'ghost',
                      size: 'large',
                      intent: item.intent ?? 'secondary',
                    }, styles.mobileMenuItem)}
                    onClick={() => item.handler}
                    data-has-icons={hasIcons || undefined}
                  >
                    {item.icon && (
                      <div className={styles.mobileMenuItemIcon}>{item.icon}</div>
                    )}
                    <div className={styles.mobileMenuItemLabel}>
                      {item.label}
                    </div>
                  </Base.Close>
                ))}
              </div>
            ))}
          </Base.Content>
        </Base.Popup>
      </Base.Viewport>
    </Base.Portal>
  </Base.Root>
);
