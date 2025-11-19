import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { X } from 'lucide-react';

import { Button } from '../Button';
import { ScrollArea } from '../ScrollArea';
import {
  closeDialog,
  DialogProps,
  removeDialog,
} from './DialogProvider.store';

import styles from './Dialog.module.scss';

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
  const handleOpenChange = (id: string, open: boolean): void => {
    if (!open) {
      if (onCancel) {
        onCancel();
      } else {
        closeDialog(id);
      }
    }
  };
  const handleOpenChangeComplete = (open: boolean): void => {
    if (!open) {
      removeDialog(id);
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
        <BaseDialog.Backdrop className={styles.Dialog_Backdrop} />
        <BaseDialog.Popup className={styles.Dialog_Popup}>
          <div className={styles.Dialog_Header}>
            <BaseDialog.Title>
              {title}
            </BaseDialog.Title>
            {!preventCancel && (
              <BaseDialog.Close render={(props) => (
                <Button {...props} icon={<X />} variant="ghost" />
              )} />
            )}
          </div>
          <ScrollArea className={styles.Dialog_Content} data-padding={!disablePadding}>
            {content}
          </ScrollArea>
          <div className={styles.Dialog_Footer}>
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
    </BaseDialog.Root>
  );
};
