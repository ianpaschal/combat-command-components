import type { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Accordion } from './Accordion';
import { AccordionItem } from './Accordion.types';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    bodyBackground: 'var(--color-page-bg)',
  },
  decorators: [
    (Story) => (
      <Card style={{ width: '20rem' }}>
        <Story />
      </Card>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items to be open at the same time.',
    },
    items: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const items: AccordionItem[] = [
  { value: 'overview', label: 'Overview', content: 'Overview content' },
  { value: 'roster', label: 'Roster', content: 'Roster content' },
  { value: 'players', label: 'Players', content: 'Players content' },
];

export const Default: Story = {
  name: 'Default',
  args: {
    multiple: false,
    defaultValue: ['overview'],
    items,
  },
};

export const Multiple: Story = {
  name: 'Multiple Open',
  args: {
    multiple: true,
    defaultValue: ['overview', 'roster'],
    items,
  },
};

export const Nested: Story = {
  name: 'Nested (Archive)',
  args: {
    multiple: true,
    defaultValue: [2026, '2026-June'],
    items: [
      {
        value: 2026,
        label: 2026,
        children: [
          {
            value: '2026-June',
            label: 'June',
            content: ['Patch Notes: June Update', 'Designing the Tournament Bracket'].map((post) => (
              <p key={post}>{post}</p>
            )),
          },
          {
            value: '2026-May',
            label: 'May',
            content: <p>Behind the Scenes: Unit Balance</p>,
          },
        ],
      },
      {
        value: 2025,
        label: 2025,
        children: [
          {
            value: '2025-December',
            label: 'December',
            content: ['Year in Review', 'Holiday Skins Reveal'].map((post) => (
              <p key={post}>{post}</p>
            )),
          },
        ],
      },
    ],
  },
};
