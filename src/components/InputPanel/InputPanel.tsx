import {
  ButtonHTMLAttributes,
  CSSProperties,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import clsx from 'clsx';

import { getCssValue } from '../../utils/getCssValue';
import { sx } from '../../utils/getStyleClassNames';
import { ScrollArea } from '../ScrollArea';

import sizes from '../../style/sizes.module.scss';
import drawerStyles from '../Drawer/Drawer.module.scss';
import styles from './InputPanel.module.scss';

export interface InputPanelContentProps<T> {
  close: () => void;
  onChange: (value: T) => void;
  value: T | undefined;
}

export interface InputPanelProps<T = string> {
  className?: string;
  closeOnChange?: boolean;
  defaultValue?: T;
  disabled?: boolean;
  disablePadding?: boolean;
  disableScroll?: boolean;
  renderValue?: (value: T | undefined) => ReactNode;
  renderTrigger?: (value: T | undefined, triggerProps: ButtonHTMLAttributes<HTMLButtonElement>) => ReactElement;
  fullHeight?: boolean;
  fullWidth?: boolean;
  icon?: ReactElement;
  id?: string;
  maxHeight?: CSSProperties['maxHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  mobile?: boolean;
  name?: string;
  onChange?: (value: T) => void;
  placeholder?: string;
  readOnly?: boolean;
  renderContent: (props: InputPanelContentProps<T>) => ReactNode;
  serialize?: (value: T | undefined) => string;
  value?: T;
}

export const InputPanel = forwardRef(<T,>({
  className,
  closeOnChange = true,
  defaultValue,
  disabled = false,
  disablePadding = false,
  disableScroll = false,
  renderValue,
  renderTrigger,
  fullHeight = false,
  fullWidth = false,
  icon,
  id,
  maxHeight,
  maxWidth,
  mobile = false,
  name,
  onChange,
  placeholder = 'Select...',
  readOnly = false,
  renderContent,
  serialize,
  value: controlledValue,
}: InputPanelProps<T>, ref: ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const [value, setValue] = useState<T | undefined>(controlledValue ?? defaultValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (v: T): void => {
    setValue(v);
    onChange?.(v);
    if (closeOnChange) {
      setOpen(false);
    }
  };

  const label = renderValue?.(value);

  const triggerProps = {
    ref,
    id,
    disabled,
    'data-readonly': readOnly || undefined,
    ...(renderTrigger ? {
      render: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
        renderTrigger(value, { type: 'button', ...props })
      ),
    } : {
      className: sx({
        corners: 'normal',
        variant: 'ghost',
        border: !readOnly,
        size: 'normal',
      }, styles.inputPanelTrigger, className),
      children: (
        <>
          {icon && (
            <span className={sizes.icon}>
              {icon}
            </span>
          )}
          <span className={clsx(styles.inputPanelTriggerLabel, !label && styles.inputPanelTriggerPlaceholder)}>
            {label || placeholder}
          </span>
        </>
      ),
    }),

  };

  const contentProps: InputPanelContentProps<T> = {
    close: () => setOpen(false),
    onChange: handleChange,
    value,
  };

  return (
    <BaseDrawer.Root open={readOnly ? false : open} onOpenChange={setOpen} swipeDirection="down" >
      {name && serialize && (
        <input type="hidden" name={name} id={id} value={serialize(value)} />
      )}
      <div className={styles.inputPanel}>
        <BaseDrawer.Trigger {...triggerProps} />
      </div>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className={drawerStyles.drawerBackdrop} />
        <BaseDrawer.Viewport className={mobile ? drawerStyles.drawerViewport : styles.inputPanelViewport}>
          <BaseDrawer.Popup
            className={sx({ variant: 'surface', border: true }, mobile ? drawerStyles.drawerPopup : styles.inputPanelPopup)}
            data-full-height={fullHeight || undefined}
            data-full-width={fullWidth || undefined}
            data-padding={!disablePadding}
            style={{
              '--input-panel-user-max-height': getCssValue(maxHeight),
              '--input-panel-user-max-width': getCssValue(maxWidth),
              '--drawer-user-max-height': getCssValue(maxHeight),
            } as CSSProperties}
          >
            <BaseDrawer.Content className={drawerStyles.drawerInner}>
              {disableScroll ? (
                <div className={styles.inputPanelContent} data-padding={!disablePadding}>
                  {renderContent(contentProps)}
                </div>
              ) : (
                <ScrollArea className={drawerStyles.drawerScrollArea}>
                  <div className={styles.inputPanelContent} data-padding={!disablePadding}>
                    {renderContent(contentProps)}
                  </div>
                </ScrollArea>
              )}
            </BaseDrawer.Content>
            {mobile && (
              <div className={drawerStyles.drawerHandle}>
                <div className={sx({ variant: 'shaded' }, drawerStyles.drawerHandleIndicator)} />
              </div>
            )}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root >
  );
}) as (<T>(props: InputPanelProps<T> & RefAttributes<HTMLButtonElement>) => JSX.Element) & {
  displayName?: string;
};

InputPanel.displayName = 'InputPanel';
