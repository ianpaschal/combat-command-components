import type { Meta, StoryObj } from '@storybook/react';

import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundUrl: { control: 'text' },
    maxWidth: { control: 'number' },
    minHeight: { control: 'number' },
    maxHeight: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxHeight: 400,
    maxWidth: 1024,
    children: (
      <>
        <span style={{ margin: 0, fontSize: '2.5rem', maxWidth: '50%' }}>Combat Command</span>
        <span style={{ margin: 0, fontSize: '1.25rem', maxWidth: '50%' }}>
          Elevate your historical war-gaming experience.
        </span>
        <span style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', maxWidth: '50%', opacity: 0.85 }}>
          Whether you're a casual player or the organizer of a highly competitive tournament,
          Combat Command is the digital half of your dice box.
        </span>
        <a
          href="#"
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            background: '#0588f0',
            color: 'white',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Get Started
        </a>
      </>
    ),
    backgroundUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&q=80',
  },
};
