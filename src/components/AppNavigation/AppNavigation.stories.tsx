import type { Meta, StoryObj } from '@storybook/react';

import { AppNavigation } from './AppNavigation';
import { Route } from './AppNavigation.types';

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

const sampleRoutes: Route[] = [
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
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    mobile: false,
    routes: sampleRoutes,
    secondaryControls: <button>Click me</button>,
  },
};

export const Mobile: Story = {
  args: {
    mobile: true,
    routes: sampleRoutes,
    secondaryControls: <button>Click me</button>,
  },
};
