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
    bodyBackground: 'var(--color-page-bg)',
    docs: {
      story: { inline: false, height: '20rem' },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Optional name rendered beside the logo.',
    },
    glass: {
      control: 'boolean',
      description: 'Whether the bar background is translucent and blurred.',
    },
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
    logoSize: {
      control: 'text',
      description: 'Size of the logo as a CSS length (e.g. "2rem"). A number is treated as px.',
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
            variant: 'surface',
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
    <Button icon={<User />} variant="shaded" rounded />
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

export const Glass: Story = {
  args: {
    ...defaultProps,
    glass: true,
  },
  parameters: {
    docs: {
      story: { inline: false, height: '30rem' },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <div style={{
          boxSizing: 'border-box',
          margin: '0 auto',
          maxWidth: '48rem',
          padding: '5rem 1rem 4rem',
        }}>
          {Array.from({ length: 12 }, (_, i) => {
            const hue = (i * 47) % 360;
            const light = i % 3 === 0;
            return (
              <article key={i} style={{ marginBottom: '3rem' }}>
                <div style={{
                  background: [
                    `radial-gradient(circle at ${20 + (i * 17) % 60}% 40%, hsl(${hue + 40} 90% ${light ? 90 : 60}%) 0%, transparent 45%)`,
                    `linear-gradient(135deg, hsl(${hue} ${light ? 40 : 80}% ${light ? 85 : 30}%), hsl(${hue + 80} 70% ${light ? 95 : 15}%))`,
                  ].join(', '),
                  borderRadius: '0.5rem',
                  height: '16rem',
                }} />
                <h2 style={{ margin: '1rem 0 0.5rem' }}>Blog Post Number {i + 1}</h2>
                <p style={{ margin: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </article>
            );
          })}
        </div>
      </>
    ),
  ],
};
