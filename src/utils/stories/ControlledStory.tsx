import {
  ComponentType,
  ReactNode,
  useState,
} from 'react';

import { Button } from '../../components/Button';
import { ScrollArea } from '../../components/ScrollArea';
import { sx } from '../getStyleClassNames';

export interface ControlledStoryAction<TValue> {
  label: string;
  value: TValue;
}

export interface ControlledStoryProps<
  TValue,
  TProps extends { value?: TValue; onChange?: (value: TValue) => void },
> {
  actions: ControlledStoryAction<TValue>[];
  component: ComponentType<TProps>;
  initialValue: TValue;
  props: Omit<TProps, 'value' | 'onChange'>;
  renderValue?: (value: TValue) => ReactNode;
}

/**
 * Generic Storybook wrapper for demonstrating a controlled component: renders the component with
 * externally-managed state, the current value, and a row of buttons to set that value
 * programmatically.
 */
export const ControlledStory = <
  TValue,
  TProps extends { value?: TValue; onChange?: (value: TValue) => void },
>({
  actions,
  component: Component,
  initialValue,
  props,
  renderValue = (value) => (
    <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
  ),
}: ControlledStoryProps<TValue, TProps>): JSX.Element => {
  const [value, setValue] = useState<TValue>(initialValue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Component
        {...(props as TProps)}
        value={value}
        onChange={setValue}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong>Current value:</strong>
        <ScrollArea
          className={sx({ variant: 'surface', border: true, corners: 'normal' })}
          style={{ height: 'auto', maxHeight: 240, fontSize: 12, fontWeight: 400 }}
        >
          <div style={{ padding: 12 }}>
            {renderValue(value)}
          </div>
        </ScrollArea>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {actions.map((action) => (
          <Button key={action.label} text={action.label} onClick={() => setValue(action.value)} />
        ))}
      </div>
    </div>
  );
};
