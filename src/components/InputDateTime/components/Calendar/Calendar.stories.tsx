import { ReactElement, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { table: { disable: true } },
    selected: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledCalendar = (): ReactElement => {
  const [selected, setSelected] = useState(new Date());
  return <Calendar onSelect={setSelected} selected={selected} />;
};

export const Default: Story = {
  render: () => <ControlledCalendar />,
};
