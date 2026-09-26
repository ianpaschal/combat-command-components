import {
  ComponentType,
  ReactNode,
  useState,
} from 'react';

import { Button } from '../../components/Button';

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
  renderValue = (value) => JSON.stringify(value),
}: ControlledStoryProps<TValue, TProps>): JSX.Element => {
  const [value, setValue] = useState<TValue>(initialValue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Component
        {...(props as TProps)}
        value={value}
        onChange={setValue}
      />
      <span>Current value: <strong>{renderValue(value)}</strong></span>
      <div style={{ display: 'flex', gap: 8 }}>
        {actions.map((action) => (
          <Button key={action.label} text={action.label} onClick={() => setValue(action.value)} />
        ))}
      </div>
    </div>
  );
};
