import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '90vw' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    currentPage: { table: { disable: true } },
    onNavigate: { table: { disable: true } },
    lastPage: {
      control: 'number',
      description: 'The last available page number.',
      table: { category: 'Content' },
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the page buttons have rounded ends.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'The size of the page buttons.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PaginationStory = (args: Parameters<typeof Pagination>[0]) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    />
  );
};

export const Default: Story = {
  name: 'Default',
  args: {
    currentPage: 4,
    lastPage: 10,
    rounded: false,
    size: 'normal',
  },
  render: (args) => <PaginationStory {...args} />,
};
