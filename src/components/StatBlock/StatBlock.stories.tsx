import { ReactElement, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { StatBlock } from './StatBlock';

const meta: Meta<typeof StatBlock> = {
  title: 'Components/StatBlock',
  component: StatBlock,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total match results',
    value: 3392,
  },
};

export const Percentage: Story = {
  args: {
    format: { maximumFractionDigits: 0 },
    label: 'Attacker win rate',
    suffix: '%',
    value: 53.4,
  },
};

const ChangingValue = (): ReactElement => {
  const [value, setValue] = useState(1250);
  return (
    <button type="button" onClick={() => setValue(Math.round(Math.random() * 5000))}>
      <StatBlock label="Total match results" value={value} />
    </button>
  );
};

export const ClickToChangeValue: Story = {
  render: () => <ChangingValue />,
};
