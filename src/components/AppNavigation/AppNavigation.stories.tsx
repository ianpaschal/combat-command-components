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
    mobile: {
      control: 'boolean',
      description: 'Whether to show mobile navigation (drawer) or desktop navigation.',
    },
  },
};

const defaultProps: AppNavigationProps = {
  routes: [
    {
      title: 'Overview',
      path: '/overview',
      children: [
        { title: 'Quick Start', path: '/overview/quick-start' },
        { title: 'Accessibility', path: '/overview/accessibility' },
        { title: 'Releases', path: '/overview/releases' },
      ],
    },
    {
      title: 'Handbook',
      path: '/handbook',
      children: [
        { title: 'Styling', path: '/handbook/styling' },
        { title: 'Animation', path: '/handbook/animation' },
        { title: 'Composition', path: '/handbook/composition' },
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
