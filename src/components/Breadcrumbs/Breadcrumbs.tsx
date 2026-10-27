import { ReactElement,ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { sx } from '../../utils/getStyleClassNames';
import { handleNavigationClick } from '../../utils/handleNavigationClick';

import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
  rounded?: boolean;
}

export const Breadcrumbs = ({
  className,
  items,
  onNavigate,
  rounded = false,
}: BreadcrumbsProps): ReactElement => (
  <nav className={clsx(styles.breadcrumbs, className)} aria-label="Breadcrumb">
    <ol className={styles.breadcrumbsList}>
      {items.map(({ label, href }, i) => {
        const isCurrent = i === items.length - 1;
        return (
          <li key={i} className={styles.breadcrumbsItem}>
            {i > 0 && (
              <ChevronRight aria-hidden />
            )}
            {href ? (
              <a
                className={sx({
                  variant: 'ghost',
                  size: 'small',
                  corners: 'normal',
                  rounded,
                  collapsePadding: true,
                }, styles.breadcrumbsLink)}
                href={href}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={(e) => handleNavigationClick(e, href, onNavigate)}
              >
                {label}
              </a>
            ) : (
              <span aria-current={isCurrent ? 'page' : undefined}>
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
