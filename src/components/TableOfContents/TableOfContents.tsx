import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';

import { sx } from '../../utils/getStyleClassNames';
import { useActiveHeading } from './TableOfContents.hooks';

import styles from './TableOfContents.module.scss';

type IndicatorState = {
  top: number;
  height: number;
};

export interface TableOfContentsItem {
  id: string;
  label: string;
}

export interface TableOfContentsProps {
  className?: string;
  items: TableOfContentsItem[];
  offset?: number;
}

export const TableOfContents = ({
  className,
  items,
  offset,
}: TableOfContentsProps): JSX.Element => {
  const activeId = useActiveHeading(items.map((item) => item.id), offset);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<IndicatorState | null>(null);

  useLayoutEffect(() => {
    const link = activeId ? linkRefs.current[activeId] : null;
    setIndicator(link ? { top: link.offsetTop, height: link.offsetHeight } : null);
  }, [activeId, items]);

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', `#${id}`);
  };

  return (
    <div className={clsx(styles.tableOfContents, className)}>
      <div className={styles.tableOfContentsTrack}>
        {indicator && (
          <span
            className={styles.tableOfContentsIndicator}
            style={{
              height: indicator.height,
              transform: `translateY(${indicator.top}px)`,
            }}
            aria-hidden
          />
        )}
      </div>
      <ul className={styles.tableOfContentsList}>
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              ref={(el) => linkRefs.current[id] = el}
              className={sx({
                variant: 'ghost',
                size: 'small',
                corners: 'normal',
              }, styles.tableOfContentsLink)}
              href={`#${id}`}
              aria-current={id === activeId ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(id);
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div >
  );
};
