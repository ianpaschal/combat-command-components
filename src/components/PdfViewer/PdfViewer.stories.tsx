import {
  useCallback,
  useRef,
  useState,
} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from 'lucide-react';

import { Button } from '../Button';
import { PdfViewer } from './PdfViewer';

const meta: Meta<typeof PdfViewer> = {
  title: 'Components/PdfViewer',
  component: PdfViewer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    file: {
      control: false,
      description: 'The PDF file source. Can be a URL string, File object, or ArrayBuffer.',
      table: { category: 'Content' },
    },
    initialPage: {
      control: 'number',
      description: 'The initial page number to display.',
      table: { category: 'Navigation' },
    },
    initialScale: {
      control: { type: 'range', min: 0.25, max: 4, step: 0.25 },
      description: 'The initial zoom scale.',
      table: { category: 'Zoom' },
    },
    minScale: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Minimum zoom scale.',
      table: { category: 'Zoom' },
    },
    maxScale: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Maximum zoom scale.',
      table: { category: 'Zoom' },
    },
    scaleStep: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Zoom increment per step.',
      table: { category: 'Zoom' },
    },
    showControls: {
      control: 'boolean',
      description: 'Whether to show the navigation and zoom controls toolbar.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'URL Source',
  args: {
    file: '/sample.pdf',
    initialPage: 1,
    initialScale: 1,
    minScale: 0.25,
    maxScale: 4,
    scaleStep: 0.25,
    showControls: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoControls: Story = {
  name: 'No Controls',
  args: {
    file: '/sample.pdf',
    showControls: false,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};

const FileUploadStory = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    }
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!file ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--gray-11)' }}>Select a PDF file to preview</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            text="Choose PDF"
            icon={<Upload />}
            variant="outlined"
            onClick={() => inputRef.current?.click()}
          />
        </div>
      ) : (
        <PdfViewer file={file} />
      )}
    </div>
  );
};

export const FileUpload: Story = {
  name: 'File Upload',
  render: () => <FileUploadStory />,
};
