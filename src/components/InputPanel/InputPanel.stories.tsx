import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  InputPanel,
  InputPanelContentProps,
  InputPanelProps,
} from './InputPanel';

const meta: Meta<typeof InputPanel> = {
  title: 'Components/InputPanel',
  component: InputPanel,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    icon: { table: { disable: true } },
    renderContent: { table: { disable: true } },
    serialize: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only (no border, panel cannot be opened).',
      table: { category: 'Behavior' },
    },
    mobile: {
      control: 'boolean',
      description: 'Renders a bottom drawer instead of an anchored popover.',
      table: { category: 'Behavior' },
    },
    closeOnChange: {
      control: 'boolean',
      description: 'Whether the panel closes automatically when a value is selected.',
      table: { category: 'Behavior' },
    },
    disablePadding: {
      control: 'boolean',
      description: 'Remove padding from the panel content area.',
      table: { category: 'Appearance' },
    },
    fullHeight: {
      control: 'boolean',
      description: 'Expand the panel to the full usable viewport height.',
      table: { category: 'Appearance' },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expand the panel to the full usable viewport width.',
      table: { category: 'Appearance' },
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the panel.',
      table: { category: 'Appearance' },
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the panel.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = Array.from({ length: 60 }, (_, i) => `Item ${i + 1}`);

const TallContent = ({ onChange, value }: InputPanelContentProps<string>) => (
  <div>
    {ITEMS.map((item) => (
      <button
        key={item}
        onClick={() => onChange(item)}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.75rem',
          textAlign: 'left',
          background: value === item ? 'var(--color-accent)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          font: 'inherit',
        }}
      >
        {item}
      </button>
    ))}
  </div>
);

export const TallContent_: Story = {
  name: 'Tall Content',
  args: {
    disabled: false,
    readOnly: false,
    mobile: false,
    closeOnChange: true,
    placeholder: 'Select an item...',
  },
  render: (args) => (
    <InputPanel<string>
      {...(args as InputPanelProps<string>)}
      fullHeight
      disablePadding
      renderValue={(v) => v}
      renderContent={(props) => <TallContent {...props} />}
    />
  ),
};

const COLORS = ['Red', 'Green', 'Blue', 'Yellow', 'Purple'];

const ColorContent = ({ onChange, value }: InputPanelContentProps<string>) => (
  <div>
    {COLORS.map((color) => (
      <button
        key={color}
        onClick={() => onChange(color)}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.75rem',
          textAlign: 'left',
          background: value === color ? 'var(--color-accent)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          font: 'inherit',
        }}
      >
        {color}
      </button>
    ))}
  </div>
);

export const Clearable_: Story = {
  name: 'Clearable (Uncontrolled)',
  args: {
    disabled: false,
    readOnly: false,
    placeholder: 'Select a color...',
  },
  render: (args) => (
    <InputPanel<string>
      {...(args as InputPanelProps<string>)}
      clearable
      clearValue=""
      renderValue={(v) => v || undefined}
      renderContent={(props) => <ColorContent {...props} />}
    />
  ),
};

const ClearableControlledStory = (args: InputPanelProps<string>): JSX.Element => {
  const [value, setValue] = useState<string>('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputPanel<string>
        {...args}
        clearable
        clearValue=""
        value={value}
        onChange={setValue}
        renderValue={(v) => v || undefined}
        renderContent={(props) => <ColorContent {...props} />}
      />
      <span>Current value: <strong>{value || 'empty'}</strong></span>
    </div>
  );
};

export const ClearableControlled_: Story = {
  name: 'Clearable (Controlled)',
  args: {
    disabled: false,
    readOnly: false,
    placeholder: 'Select a color...',
  },
  render: (args) => <ClearableControlledStory {...(args as InputPanelProps<string>)} />,
};

export const ReadOnly_: Story = {
  name: 'Read Only',
  args: {
    disabled: false,
    readOnly: true,
    placeholder: 'Select a color...',
  },
  render: (args) => (
    <InputPanel<string>
      {...(args as InputPanelProps<string>)}
      defaultValue="Blue"
      renderValue={(v) => v}
      renderContent={(props) => <ColorContent {...props} />}
    />
  ),
};
