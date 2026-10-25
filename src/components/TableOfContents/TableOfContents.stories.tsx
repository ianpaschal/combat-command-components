import type { Meta, StoryObj } from '@storybook/react';

import { TableOfContents } from './TableOfContents';

const sections = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'standings', label: 'Standings' },
  { id: 'feedback', label: 'Feedback' },
];

const meta: Meta<typeof TableOfContents> = {
  title: 'Components/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    items: {
      control: 'object',
      description: 'The headings to link to. Each id must match an element id on the page.',
      table: { category: 'Content' },
    },
    offset: {
      control: 'number',
      description: 'Distance in pixels from the top of the viewport at which a heading becomes active. Defaults to the document\'s `scroll-padding-top`.',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: '2rem', padding: '1rem' }}>
        <div>
          {args.items.map(({ id, label }) => (
            <section key={id} style={{ minHeight: '80vh' }}>
              <h2 id={id}>{label}</h2>
              <p>Placeholder content for the {label} section.</p>
            </section>
          ))}
        </div>
        <div style={{ position: 'sticky', top: '1rem', alignSelf: 'start' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    items: sections,
    offset: 96,
  },
};
