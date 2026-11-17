import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { InputFile, InputFileValue } from './InputFile';

const meta: Meta<typeof InputFile> = {
  title: 'Inputs/InputFile',
  component: InputFile,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, height: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'object',
      description: 'The accepted MIME types or file extensions.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
      table: { category: 'Behavior' },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the file is being processed (e.g. uploaded).',
      table: { category: 'Behavior' },
    },
    placeholder: {
      control: 'text',
      description: 'The text shown in the empty dropzone.',
      table: { category: 'Content' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledInputFile = (args: Story['args']) => {
  const [value, setValue] = useState<InputFileValue | null>(args?.value ?? null);

  const handleChange = (file: File | null): void => {
    setValue(file ? { name: file.name } : null);
  };

  return <InputFile {...args} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  name: 'Default',
  args: {
    accept: ['application/pdf', '.jpg', '.jpeg', '.png'],
    disabled: false,
    loading: false,
  },
  render: (args) => <ControlledInputFile {...args} />,
};

export const WithValue: Story = {
  name: 'With Value',
  args: {
    value: {
      name: 'army-list.pdf',
    },
  },
  render: (args) => <ControlledInputFile {...args} />,
};

export const Loading: Story = {
  name: 'Loading',
  args: {
    loading: true,
  },
};
