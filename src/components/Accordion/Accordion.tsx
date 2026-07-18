import { ReactElement } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { sx } from '../../utils';
import { AccordionItem, AccordionValue } from './Accordion.types';

import styles from './Accordion.module.scss';

export interface AccordionProps {
  className?: string;
  defaultValue?: AccordionValue[];
  items: AccordionItem[];
  multiple?: boolean;
  onValueChange?: (value: AccordionValue[]) => void;
  value?: AccordionValue[];
}

export const Accordion = ({
  className,
  items,
  multiple = false,
  ...props
}: AccordionProps): ReactElement => (
  <BaseAccordion.Root
    className={clsx(styles.accordion, className)}
    multiple={multiple}
    {...props}
  >
    {items.map((item) => {
      if ((item.children === undefined) === (item.content === undefined)) {
        throw new Error(`Accordion item "${item.value}" must have either "children" or "content".`);
      }
      return (
        <BaseAccordion.Item key={item.value} className={styles.accordionItem} value={item.value}>
          <BaseAccordion.Header className={styles.accordionTriggerHeader}>
            <BaseAccordion.Trigger
              className={sx({ variant: 'ghost', size: 'small', corners: 'normal' }, styles.accordionTrigger)}
              render={(triggerProps, state) => (
                <button type="button" {...triggerProps}>
                  <ChevronRight className={styles.accordionTriggerChevron} />
                  {typeof item.label === 'function' ? item.label(state) : item.label}
                </button>
              )}
            />
          </BaseAccordion.Header>
          <BaseAccordion.Panel
            className={styles.accordionPanel}
            data-nested={item.children !== undefined || undefined}
          >
            {item.children ? (
              <Accordion items={item.children} multiple={multiple} />
            ) : item.content}
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      );
    })}
  </BaseAccordion.Root>
);
