import type { Meta, StoryObj } from '@storybook/react';

import { MarkdownRenderer } from './MarkdownRenderer';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Components/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    content: {
      control: 'text',
      description: 'The raw markdown content to sanitize and render.',
      table: { category: 'Content' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: [
      '## Tournament Rules',
      '',
      'Welcome to the **Autumn Championship**. Please read the following before registering.',
      '',
      '- Lists must be submitted 48 hours in advance.',
      '- All models must be painted to a 3-color standard.',
      '- Games are timed at 2.5 hours per round.',
      '',
      'Questions? Contact the organizer.',
    ].join('\n'),
  },
};
