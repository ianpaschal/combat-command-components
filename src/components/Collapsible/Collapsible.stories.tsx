import type { Meta, StoryObj } from '@storybook/react';
import { ChevronDown } from 'lucide-react';

import { sx } from '../../utils';
import { Collapsible } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: { control: 'boolean' },
    trigger: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    defaultOpen: false,
    trigger: (state) => (
      <div className={sx({ variant: 'ghost' })} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.75rem 1rem',
      }}
      >
        Auto-Assign
        <ChevronDown
          size={16}
          style={{
            flexShrink: 0,
            transform: state.open ? 'rotate(180deg)' : undefined,
            transition: 'transform 150ms ease-in-out',
          }}
        />
      </div>
    ),
    children: (
      <div className={sx({ border: 'top' })} style={{ padding: '1rem', marginTop: '0.25rem' }}>
        Panel contents, styled entirely by the consumer.
      </div>
    ),
  },
  render: (args) => (
    <Collapsible
      {...args}
      className={sx({ variant: 'surface', corners: 'wide', border: true })}

      style={{ width: '20rem' }}
    />
  ),
};

export const OpenByDefault: Story = {
  name: 'Open by Default',
  args: {
    ...Default.args,
    defaultOpen: true,
  },
  render: Default.render,
};
