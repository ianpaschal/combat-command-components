import { ReactNode } from 'react';
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button, ButtonProps } from '../Button';
import { ScrollArea } from '../ScrollArea';
import { useDialogs } from './DialogProvider.hooks';

import styles from './Dialog.module.scss';

export type DialogProps = {
  actions?: ButtonProps[];
  content: ReactNode;
  disablePadding?: boolean;
  id: string;
  onCancel?: () => void;
  open: boolean;
  preventCancel?: boolean;
  title: string;
};

export interface DialogPropsWithNested extends DialogProps {
  nested?: DialogProps[];
}

export const Dialog = ({
  actions,
  content,
  disablePadding = false,
  id,
  nested,
  onCancel,
  open,
  preventCancel = false,
  title,
}: DialogPropsWithNested): JSX.Element => {
  const { close, remove } = useDialogs();
  const handleOpenChange = (id: string, open: boolean): void => {
    if (!open) {
      if (onCancel) {
        onCancel();
      } else {
        close(id);
      }
    }
  };
  const handleOpenChangeComplete = (open: boolean): void => {
    if (!open) {
      remove(id);
    }
  };
  const [child, ...children] = nested ?? [];
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(open) => handleOpenChange(id, open)}
      onOpenChangeComplete={handleOpenChangeComplete}
      disablePointerDismissal={preventCancel}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.dialogBackdrop} />
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
          <ScrollArea className={styles.dialogContent} data-padding={!disablePadding}>
            {content}
          </ScrollArea>
          <div className={styles.dialogFooter}>
            {!preventCancel && (
              <BaseDialog.Close render={(props) => (
                <Button {...props} text="Cancel" variant="secondary" />
              )} />
            )}
            {actions?.length ? actions.map((action, i) => (
              <BaseDialog.Close key={`action_${i}`} render={(props) => (
                <Button {...props} {...action} />
              )} />
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
    </BaseDialog.Root >
  );
};
