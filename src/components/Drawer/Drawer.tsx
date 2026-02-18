import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { DrawerPreview as BaseDrawer, DrawerRootProps } from '@base-ui/react/drawer';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { getCssVariable } from '../../utils/getCssVariable';
import { Button } from '../Button';
import { ScrollArea } from '../ScrollArea';
import { DrawerContext, DrawerContextProvider } from './Drawer.context';

import styles from './Drawer.module.scss';

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right';

const SIDE_TO_SWIPE_DIRECTION: Record<DrawerSide, DrawerRootProps['swipeDirection']> = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right',
} as const;

export interface DrawerProps {
  children: ReactNode;
  className?: string;
  disablePadding?: boolean;
  maxSize?: CSSProperties['maxWidth'];
  onClose?: (dirty: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
  side?: DrawerSide;
  title: string;
  trigger?: ReactElement;
}

export const Drawer = ({
  children,
  className,
  disablePadding = false,
  maxSize,
  onClose,
  onOpenChangeComplete,
  open,
  side = 'bottom',
  title,
  trigger,
}: DrawerProps): JSX.Element => {
  const actionsRef = useRef<BaseDrawer.Root.Actions>(null);
  const [dirty, setDirty] = useState(false);

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      onClose?.(dirty);
    }
  };

  const contextValue: DrawerContext = {
    close: () => actionsRef.current?.close(),
    dirty,
    setDirty,
  };

  return (
    <BaseDrawer.Root
      actionsRef={actionsRef}
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      swipeDirection={SIDE_TO_SWIPE_DIRECTION[side]}
    >
      {trigger && <BaseDrawer.Trigger render={trigger} />}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className={styles.drawerBackdrop} />
        <BaseDrawer.Viewport className={styles.drawerViewport}>
          <BaseDrawer.Popup
            className={clsx(styles.drawerPopup, className)}
            style={getCssVariable(side === 'left' || side === 'right' ? '--drawer-max-width' : '--drawer-max-height', maxSize)}
          >
            <BaseDrawer.Content className={styles.drawerInner}>
              <div className={styles.drawerHeader}>
                <BaseDrawer.Title>{title}</BaseDrawer.Title>
                <BaseDrawer.Close render={(props) => (
                  <Button {...props} className={styles.drawerHeaderClose} icon={<X />} variant="ghost" />
                )} />
              </div>
              <DrawerContextProvider value={contextValue}>
                <ScrollArea className={styles.drawerScrollArea} indicators={{ top: { border: true }, bottom: { border: true } }}>
                  <div className={styles.drawerContent} data-padding={!disablePadding}>
                    {children}
                  </div>
                </ScrollArea>
              </DrawerContextProvider>
            </BaseDrawer.Content>
            <div className={styles.drawerHandle}>
              <div className={styles.drawerHandleIndicator} />
            </div>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
