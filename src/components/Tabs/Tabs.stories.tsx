import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Layers,
  Swords,
  Users,
} from 'lucide-react';

import { TabsList } from './components/TabsList/TabsList';
import { TabsPanel } from './components/TabsPanel/TabsPanel';
import { Card } from '../Card';
import { Tabs } from './Tabs';
import { Tab } from './Tabs.types';

const useTabsQueryParam = (key = 'tab', defaultValue = ''): [string, (v: string) => void] => {
  const [value, setValue] = useState(() => (
    new URLSearchParams(window.location.search).get(key) ?? defaultValue
  ));

  useEffect(() => {
    const sync = () => {
      setValue(new URLSearchParams(window.location.search).get(key) ?? defaultValue);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('tabs-query-param-change', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('tabs-query-param-change', sync);
    };
  }, [key, defaultValue]);

  const handleChange = useCallback((newValue: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, newValue);
    window.history.replaceState(null, '', url.toString());
    setValue(newValue);
    window.dispatchEvent(new CustomEvent('tabs-query-param-change', { detail: { key, value: newValue } }));
  }, [key]);

  return [value, handleChange];
};

const tabs: Tab[] = [
  {
    value: 'overview',
    icon: <Layers />,
    title: 'Overview',
    content: 'Overview content',
  },
  {
    value: 'roster',
    icon: <Users />,
    title: 'Roster',
    content: 'Roster content',
  },
  {
    value: 'players',
    icon: <Swords />,
    title: 'Players',
    content: 'Players content',
  },
];

const meta: Meta<typeof TabsList> = {
  title: 'Components/Tabs',
  component: TabsList,
  parameters: {
    layout: 'centered',
    bodyBackground: 'var(--color-page-bg)',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    asFooter: {
      control: 'boolean',
      description: 'Pin the tabs list as a page footer.',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Show icons only, hiding text labels.',
    },
    maxWidth: {
      control: 'number',
      description: 'Max width of the footer tabs list (only applies when asFooter is true).',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'Size of the tabs list.',
    },
    className: { table: { disable: true } },
    render: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: { iconOnly: false, asFooter: false },
  render: (args) => (
    <Tabs defaultValue="overview" tabs={tabs}>
      <TabsList {...args} />
      <Card>
        <TabsPanel />
      </Card>
    </Tabs>
  ),
};

export const Footer: Story = {
  name: 'Footer',
  args: { iconOnly: false, asFooter: true },
  render: (args) => (
    <Tabs defaultValue="overview" tabs={tabs}>
      <TabsList {...args} />
      <TabsPanel />
    </Tabs>
  ),
};

export const FooterMaxWidth: Story = {
  name: 'Footer (Max Width)',
  argTypes: { maxWidth: { table: { disable: true } } },
  args: { iconOnly: false, asFooter: true, maxWidth: 480 },
  render: (args) => (
    <Tabs defaultValue="overview" tabs={tabs}>
      <TabsList {...args} />
      <Card>
        <TabsPanel />
      </Card>
    </Tabs>
  ),
};

const UrlStory = () => {
  const [tab, setTab] = useTabsQueryParam('tab', 'overview');
  return (
    <Tabs value={tab} onValueChange={setTab} tabs={tabs}>
      <TabsList />
      <Card>
        <TabsPanel />
      </Card>
    </Tabs>
  );
};

export const UrlState: Story = {
  name: 'URL State (?tab=)',
  render: () => <UrlStory />,
};
