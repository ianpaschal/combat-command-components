import { ReactNode, useLayoutEffect } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button, ButtonProps } from '../Button';
import { ScrollArea } from '../ScrollArea';
import { DialogContext, DialogContextProvider } from './Dialog.context';
import { useDialogManager } from './DialogManager.hooks';

import styles from './Dialog.module.scss';

export type DialogAction = Omit<ButtonProps, 'onClick'> & {
  onClick?: (id?: string) => void;
};

export type DialogProps = {
  actions?: DialogAction[];
  cancelText?: string;
  content?: ReactNode;
  dirty: boolean;
  disablePadding?: boolean;
  id: string;
  onCancel?: (dirty: boolean) => void;
  open: boolean;
  preventCancel?: boolean;
  renderContent?: (props: DialogContext) => ReactNode;
  title: string;
};

export interface DialogPropsWithNested extends DialogProps {
  nested?: DialogProps[];
}

export const Dialog = (props: DialogPropsWithNested): JSX.Element => {
  const {
    actions,
    cancelText,
    content,
    dirty,
    disablePadding = false,
    id,
    nested,
    onCancel,
    open: isOpen,
    preventCancel = false,
    renderContent,
    title,
  } = props;
  const { remove, setDirty, setOpen } = useDialogManager();

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      if (onCancel) {
        onCancel(dirty);
      } else {
        setOpen(id, false);
      }
    }
  };

  useLayoutEffect(() => {
    setOpen(id, true);
  }, [id, setOpen]);

  const handleOpenChangeComplete = (open: boolean): void => {
    if (!open) {
      remove(id);
    }
  };

  const contextValue = {
    id,
    open: isOpen,
    setOpen: (open: boolean) => setOpen(id, open),
    dirty,
    setDirty: (dirty: boolean) => setDirty(id, dirty),
  };

  const [child, ...children] = nested ?? [];
  return (
    <BaseDialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      disablePointerDismissal={true}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.dialogBackdrop} onClick={() => !preventCancel && handleOpenChange(false)} />
        <BaseDialog.Popup className={clsx(getStyleClassNames({ corners: 'wide' }), styles.dialogPopup)}>
          <div className={styles.dialogHeader}>
            <BaseDialog.Title>
              {title}
            </BaseDialog.Title>
            {!preventCancel && (
              <BaseDialog.Close render={(props) => (
                <Button {...props} icon={<X />} variant="ghost" />
              )} />
            )}
          </div>
          <DialogContextProvider value={contextValue}>
            <ScrollArea className={styles.dialogScrollArea} indicators={{ top: { border: true }, bottom: { border: true } }}>
              <div className={styles.dialogContent} data-padding={!disablePadding}>
                {renderContent ? renderContent(contextValue) : content}
              </div>
            </ScrollArea>
          </DialogContextProvider>
          <div className={styles.dialogFooter}>
            {!preventCancel && (
              <BaseDialog.Close render={(props) => (
                <Button {...props} text={cancelText ?? 'Cancel'} variant="secondary" />
              )} />
            )}
            {actions?.length ? actions.map((action, i) => (
              <Button key={`action_${i}`} {...action} onClick={() => action.onClick ? action.onClick(id) : undefined} />
            )) : (
              <BaseDialog.Close render={(props) => (
                <Button {...props} text="Confirm" />
              )} />
            )}
          </div>
          {child && (
            <Dialog {...child} nested={children} />
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
