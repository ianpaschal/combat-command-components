import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HelpCircle, User } from 'lucide-react';

import { Button } from '../Button';
import { AppNavigation, AppNavigationProps } from './AppNavigation';

const meta: Meta<typeof AppNavigation> = {
  title: 'Components/AppNavigation',
  component: AppNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    location: {
      control: 'text',
      description: 'The current path, used to highlight the active route.',
    },
    mobile: {
      control: 'boolean',
      description: 'Whether to show mobile navigation (drawer) or desktop navigation.',
    },
  },
  decorators: [
    (Story, { args }) => {
      const [location, setLocation] = useState(args.location ?? '/overview');
      return (
        <Story args={{
          ...args,
          location,
          onNavigate: (path: string) => {
            console.log('navigate', path);
            setLocation(path);
          },
        }} />
      );
    },
  ],
};

const defaultProps: AppNavigationProps = {
  location: '/overview',
  onNavigate: (path) => console.log('navigate', path),
  routes: [
    {
      title: 'Overview',
      path: '/overview',
      children: [
        { title: 'Quick Start', path: '/overview/quick-start' },
        { title: 'Accessibility', path: '/overview/accessibility' },
        { title: 'Releases', path: '/overview/releases' },
        {
          title: 'Components',
          path: '/overview/components',
          children: [
            { title: 'Button', path: '/overview/components/button' },
            { title: 'Input', path: '/overview/components/input' },
            { title: 'Select', path: '/overview/components/select' },
          ],
        },
      ],
    },
    {
      title: 'Handbook',
      path: '/handbook',
      children: [
        { title: 'Styling', path: '/handbook/styling' },
        {
          title: 'Advanced',
          path: '/handbook/advanced',
          children: [
            { title: 'Animation', path: '/handbook/advanced/animation' },
            { title: 'Composition', path: '/handbook/advanced/composition' },
            { title: 'Server Rendering', path: '/handbook/advanced/ssr' },
          ],
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/mui/base-ui',
    },
  ],
  secondaryControls: (
    <Button icon={<User />} variant="secondary" rounded />
  ),
  secondaryRoutes: [
    {
      icon: <HelpCircle />,
      title: 'Help',
      path: 'https://www.combatcommand.net/help',
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    ...defaultProps,
    mobile: false,
  },
};

export const Mobile: Story = {
  args: {
    ...defaultProps,
    mobile: true,
  },
};

export const Scrollable: Story = {
  args: {
    ...defaultProps,
    mobile: false,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ paddingTop: 'var(--app-bar-height)', height: '300vh', background: 'linear-gradient(to bottom, var(--gray-2), var(--gray-4))' }} />
      </div>
    ),
  ],
};
