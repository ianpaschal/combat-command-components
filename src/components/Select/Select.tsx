import { ComponentProps } from 'react';
import { Select as BaseSelect } from '@base-ui-components/react/select';
import clsx from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Select.module.scss';

const normalizeItems = (
  items: ComponentProps<typeof BaseSelect.Root>['items'],
): Array<{ value: string; label: string }> => {
  if (!items) {
    return [];
  }
  if (Array.isArray(items)) {
    return items;
  }
  return Object.entries(items).map(([value, label]) => ({ value, label }));
};

type SelectValue = string | number | null;

export interface SelectProps extends ComponentProps<typeof BaseSelect.Root> {
  placeholder?: string;
}

export const Select = ({
  items,
  placeholder,
  ...restProps
}: SelectProps): JSX.Element => {
  const normalizedItems = normalizeItems(items);
  const renderValue = (value: SelectValue | SelectValue[]): string | undefined => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return placeholder ?? '';
      }
      const label = normalizedItems.find((item) => item.value === value[0])?.label;
      const suffix = value.length > 1 ? ` & ${value.length - 1} more` : '';
      return label + suffix;
    } else {
      return normalizedItems.find((item) => item.value === value)?.label;
    }
  };
  return (
    <BaseSelect.Root items={items} {...restProps}>
      <BaseSelect.Trigger className={clsx(getStyleClassNames({
        variant: 'outlined',
        size: 'normal',
        corners: 'normal',
      }), styles.selectTrigger)}>
        <BaseSelect.Value className={styles.selectValue}>
          {renderValue}
        </BaseSelect.Value>
        <BaseSelect.Icon className={styles.selectIcon}>
          <ChevronsUpDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className={styles.selectPositioner}
          sideOffset={8}
          alignItemWithTrigger={false}
          collisionPadding={16}
          sticky
        >
          <BaseSelect.Popup className={clsx(getStyleClassNames({
            variant: 'passive',
            border: true,
            corners: 'normal',
          }), styles.selectPopup)}>
            {normalizedItems.map((item) => (
              <BaseSelect.Item
                key={item.value}
                value={item.value}
                className={clsx(getStyleClassNames({
                  variant: 'ghost',
                  size: 'normal',
                  corners: 'normal',
                }), styles.selectItem)}
              >
                <BaseSelect.ItemText className={styles.selectItemText}>{item.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className={styles.selectItemIndicator}>
                  <Check />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
};
