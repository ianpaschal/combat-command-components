import type { Meta, StoryObj } from '@storybook/react';

import { PdfThumbnail } from './PdfThumbnail';

const meta: Meta<typeof PdfThumbnail> = {
  title: 'Components/PdfThumbnail',
  component: PdfThumbnail,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    file: { table: { disable: true } },
    width: {
      control: { type: 'number', min: 40, max: 400, step: 8 },
      description: 'Width (and height) of the thumbnail in pixels.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    file: '/sample.pdf',
    width: 80,
  },
};

export const Large: Story = {
  args: {
    file: '/sample.pdf',
    width: 200,
  },
};
