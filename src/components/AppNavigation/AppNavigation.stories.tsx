import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import clsx from 'clsx';
import { HelpCircle, User } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button } from '../Button';
import { CombatCommandLogo } from '../CombatCommandLogo';
import { AppNavigation, AppNavigationProps } from './AppNavigation';

const meta: Meta<typeof AppNavigation> = {
  title: 'Components/AppNavigation',
  component: AppNavigation,
  parameters: {
    layout: 'centered',
    bodyBackground: 'var(--page-bg)',
    docs: {
      story: { inline: false, height: '20rem' },
    },
  },
  argTypes: {
    location: {
      table: { disable: true },
    },
    maxWidth: {
      control: 'number',
      description: 'Constrains the inner content width.',
    },
    mobile: {
      control: 'boolean',
      description: 'Switches between desktop (dropdown) and mobile (drawer) layouts.',
    },
    portalTarget: {
      table: { disable: true },
    },
    secondaryControls: {
      table: { disable: true },
    },
    logo: {
      table: { disable: true },
    },
    logoPath: {
      control: 'text',
      description: 'Path navigated to when the logo is clicked.',
    },
    onNavigate: {
      table: { disable: true },
    },
    routes: {
      description: 'Primary navigation routes.',
    },
    secondaryRoutes: {
      description: 'Icon-only routes rendered alongside secondary controls (e.g. a help link).',
    },
    className: {
      description: 'Additional class applied to the nav bar element.',
    },
  },
  decorators: [
    (Story, { args }) => {
      const [location, setLocation] = useState(args.location ?? '/overview');
      const [portalTarget, setPortalTarget] = useState<Element | null>(null);
      return (
        <div ref={setPortalTarget} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {portalTarget && (
            <Story args={{
              ...args,
              location,
              portalTarget,
              onNavigate: setLocation,
            }} />
          )}
          <h3 style={{ textAlign: 'center' }}>Current Location</h3>
          <span className={clsx(...getStyleClassNames({
            variant: 'passive',
            corners: 'tight',
            border: true,
          }))} style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            textAlign: 'center',
          }}>
            {location}
          </span>
        </div>
      );
    },
  ],
};

const defaultProps: AppNavigationProps = {
  logo: <CombatCommandLogo />,
  logoPath: '/',
  location: '/overview',
  onNavigate: (path) => path,
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
