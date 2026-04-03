import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

import { useTabsContext } from '../../Tabs.hooks';

import styles from './TabsPanel.module.scss';

export interface TabsPanelItem {
  content: ReactNode;
  value: string;
}

export interface TabsPanelProps {
  className?: string;
}

export const TabsPanel = ({
  className,
}: TabsPanelProps): ReactElement => {
  const { value, tabs } = useTabsContext();

  const activePanel = tabs.find((p) => p.value === value);

  return (
    <div className={clsx(styles.tabsPanel, className)}>
      {activePanel && (
        <div key={value} className={styles.tabsPanelContent}>
          {activePanel.content}
        </div>
      )}
    </div>
  );
};

TabsPanel.displayName = 'TabsPanel';
