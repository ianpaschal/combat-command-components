import type { Meta, StoryObj } from '@storybook/react';

import { Table } from './Table';
import { ColumnDef, RowData } from './Table.types';

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
};

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 32, role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'User' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', age: 29, role: 'Manager' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', age: 35, role: 'Admin' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 31, role: 'Manager' },
  { id: 7, name: 'Edward Norton', email: 'edward@example.com', age: 42, role: 'User' },
  { id: 8, name: 'Fiona Apple', email: 'fiona@example.com', age: 26, role: 'User' },
  { id: 9, name: 'George Lucas', email: 'george@example.com', age: 50, role: 'Admin' },
  { id: 10, name: 'Helen Keller', email: 'helen@example.com', age: 38, role: 'Manager' },
  { id: 11, name: 'Isaac Newton', email: 'isaac@example.com', age: 33, role: 'User' },
  { id: 12, name: 'Julia Roberts', email: 'julia@example.com', age: 27, role: 'User' },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    columns: { table: { disable: true } },
    rows: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type ColumnLayoutControls = {
  nameLabel: string;
  nameWidth: string;
  nameAlign: 'left' | 'center' | 'right';
  emailLabel: string;
  emailWidth: string;
  emailAlign: 'left' | 'center' | 'right';
  ageLabel: string;
  ageWidth: string;
  ageAlign: 'left' | 'center' | 'right';
  roleLabel: string;
  roleWidth: string;
  roleAlign: 'left' | 'center' | 'right';
};

type StoryArgsWithControls = Story['args'] & ColumnLayoutControls & {
  containerHeight: number;
};

const defaultLayoutControls: ColumnLayoutControls = {
  nameLabel: 'Name',
  nameWidth: '1fr',
  nameAlign: 'left',
  emailLabel: 'Email',
  emailWidth: '1fr',
  emailAlign: 'left',
  ageLabel: 'Age',
  ageWidth: 'auto',
  ageAlign: 'right',
  roleLabel: 'Role',
  roleWidth: '150px',
  roleAlign: 'left',
};

const buildColumnsFromControls = (controls: ColumnLayoutControls): ColumnDef<RowData>[] => [
  {
    key: 'name',
    label: controls.nameLabel,
    width: controls.nameWidth,
    xAlign: controls.nameAlign,
  },
  {
    key: 'email',
    label: controls.emailLabel,
    width: controls.emailWidth,
    xAlign: controls.emailAlign,
  },
  {
    key: 'age',
    label: controls.ageLabel,
    width: controls.ageWidth,
    xAlign: controls.ageAlign,
  },
  {
    key: 'role',
    label: controls.roleLabel,
    width: controls.roleWidth,
    xAlign: controls.roleAlign,
    renderCell: (row) => (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '12px',
          backgroundColor: '#e5e7eb',
          color: '#374151',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        {row.role as string}
      </span>
    ),
  },
];

const sharedControlsArgTypes = {
  nameLabel: {
    name: 'Name Label',
    control: 'text',
    description: 'Header label for the Name column.',
    table: { category: 'Name' },
  },
  nameWidth: {
    name: 'Name Width',
    control: 'text',
    description: 'CSS width for the Name column (for example, "1fr" or "200px").',
    table: { category: 'Name' },
  },
  nameAlign: {
    name: 'Name Alignment',
    control: { type: 'inline-radio' },
    options: ['left', 'center', 'right'],
    description: 'Horizontal alignment for the Name column.',
    table: { category: 'Name' },
  },
  emailLabel: {
    name: 'Email Label',
    control: 'text',
    description: 'Header label for the Email column.',
    table: { category: 'Email' },
  },
  emailWidth: {
    name: 'Email Width',
    control: 'text',
    description: 'CSS width for the Email column.',
    table: { category: 'Email' },
  },
  emailAlign: {
    name: 'Email Alignment',
    control: { type: 'inline-radio' },
    options: ['left', 'center', 'right'],
    description: 'Horizontal alignment for the Email column.',
    table: { category: 'Email' },
  },
  ageLabel: {
    name: 'Age Label',
    control: 'text',
    description: 'Header label for the Age column.',
    table: { category: 'Age' },
  },
  ageWidth: {
    name: 'Age Width',
    control: 'text',
    description: 'CSS width for the Age column.',
    table: { category: 'Age' },
  },
  ageAlign: {
    name: 'Age Alignment',
    control: { type: 'inline-radio' },
    options: ['left', 'center', 'right'],
    description: 'Horizontal alignment for the Age column.',
    table: { category: 'Age' },
  },
  roleLabel: {
    name: 'Role Label',
    control: 'text',
    description: 'Header label for the Role column.',
    table: { category: 'Role' },
  },
  roleWidth: {
    name: 'Role Width',
    control: 'text',
    description: 'CSS width for the Role column.',
    table: { category: 'Role' },
  },
  roleAlign: {
    name: 'Role alignment',
    control: { type: 'inline-radio' },
    options: ['left', 'center', 'right'],
    description: 'Horizontal alignment for the Role column.',
    table: { category: 'Role' },
  },
  containerHeight: {
    name: 'Container height (px)',
    control: { type: 'number', min: 200, max: 800, step: 50 },
    description: 'Height of the table container in pixels.',
    table: { category: 'Container' },
  },
} as Record<string, unknown>;

export const Basic: Story = {
  args: {
    ...defaultLayoutControls,
    containerHeight: 800,
  } as StoryArgsWithControls,
  argTypes: sharedControlsArgTypes,
  render: (args) => {
    const { containerHeight, ...restArgs } = args as StoryArgsWithControls;
    return (
      <div style={{ height: containerHeight }}>
        <Table
          columns={buildColumnsFromControls(restArgs)}
          rows={users}
        />
      </div>
    );
  },
};

export const WithConstrainedSize: Story = {
  args: {
    ...defaultLayoutControls,
    containerHeight: 400,
  } as StoryArgsWithControls,
  argTypes: sharedControlsArgTypes,
  render: (args) => {
    const { containerHeight, ...restArgs } = args as StoryArgsWithControls;
    return (
      <div style={{ height: containerHeight }}>
        <Table
          columns={buildColumnsFromControls(restArgs)}
          rows={users}
        />
      </div>
    );
  },
};
