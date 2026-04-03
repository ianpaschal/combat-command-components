import {
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';

import { TabsContext } from './Tabs.context';
import { Tab } from './Tabs.types';

export interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  tabs: Tab[];
}

export const Tabs = ({
  children,
  defaultValue,
  onValueChange,
  value: controlledValue,
  tabs,
}: TabsProps): ReactElement => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const value = controlledValue ?? internalValue;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <BaseTabs.Root
      value={value}
      onValueChange={handleChange}
      render={({ children: rootChildren }) => (
        <>{rootChildren}</>
      )}
    >
      <TabsContext.Provider value={{ tabs, value, onValueChange: handleChange }}>
        {children}
      </TabsContext.Provider>
    </BaseTabs.Root>
  );
};
