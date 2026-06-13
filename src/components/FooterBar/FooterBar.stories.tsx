import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ArrowLeft,
  Save,
  X,
} from 'lucide-react';

import { ButtonProps } from '../Button';
import { Spinner } from '../Spinner';
import { FooterBar, FooterBarProps } from './FooterBar';
import { FooterBarActions } from './FooterBarActions';

interface StoryArgs extends FooterBarProps {
  mobile?: boolean;
}

const meta: Meta<StoryArgs> = {
  title: 'Components/FooterBar',
  component: FooterBar,
  parameters: {
    layout: 'centered',
    bodyBackground: 'var(--color-page-bg)',
    docs: {
      story: { inline: false, height: '12rem' },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'number',
      description: 'Constrains the inner content width.',
    },
    mobile: {
      control: 'boolean',
      description: 'Switches between desktop and mobile layouts.',
    },
    portalTarget: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
  },
  decorators: [
    (Story, { args }) => {
      const [portalTarget, setPortalTarget] = useState<Element | null>(null);
      return (
        <div ref={setPortalTarget} style={{ width: '100%', height: '100%' }}>
          {portalTarget && <Story args={{ ...args, portalTarget }} />}
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const actions: {
  left: ButtonProps[];
  right: ButtonProps[];
} = {
  left: [{ icon: <ArrowLeft />, text: 'Cancel', variant: 'shaded' }],
  right: [{ icon: <Save />, text: 'Save', variant: 'solid', intent: 'primary' }],
};

export const Default: Story = {
  args: {
    mobile: false,
  },
  render: (args) => (
    <FooterBar {...args}>
      <FooterBarActions
        mobile={args.mobile}
        {...actions}
      />
    </FooterBar>
  ),
};

export const MaxWidth: Story = {
  args: {
    mobile: false,
    maxWidth: 256,
  },
  render: (args) => (
    <FooterBar {...args}>
      <FooterBarActions
        mobile={args.mobile}
        left={[
          { icon: <X />, text: 'Cancel', variant: 'ghost' },
        ]}
        right={[
          { icon: <Save />, text: 'Save', variant: 'solid', intent: 'primary' },
        ]}
      />
    </FooterBar>
  ),
};

export const CustomElement: Story = {
  args: {
    mobile: false,
  },
  render: (args) => (
    <FooterBar {...args}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        gap: '0.75rem',
        flex: 1,
      }}>
        <Spinner size={20} />
        <span>Syncing changes…</span>
      </div>
    </FooterBar>
  ),
};
