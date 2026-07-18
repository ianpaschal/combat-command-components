import {
  CSSProperties,
  Fragment,
  ReactElement,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';

import { ElementSize } from '../../types';
import { Button, ButtonProps } from '../Button';
import { usePageSlots } from './Pagination.hooks';
import { getPages } from './Pagination.utils';

import styles from './Pagination.module.scss';

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onNavigate: (page: number) => void;
  rounded?: boolean;
  size?: ElementSize;
}

export const Pagination = ({
  currentPage,
  lastPage,
  onNavigate,
  rounded,
  size = 'normal',
}: PaginationProps): ReactElement => {
  const { trackRef, slotRef, slotCount, slotWidth } = usePageSlots(lastPage);

  const shared: Partial<ButtonProps> = {
    intent: 'secondary',
    rounded,
    size,
    variant: 'ghost',
  };

  const groups = getPages(currentPage, lastPage, slotCount);

  return (
    <nav
      className={styles.pagination}
      style={{ '--slot-size': `${slotWidth}px` } as CSSProperties}
      aria-label="Pagination"
    >
      <Button
        ref={slotRef}
        icon={<ArrowLeft />}
        disabled={currentPage === 1}
        onClick={() => onNavigate(currentPage - 1)}
        {...shared}
      />
      <div className={styles.paginationPages} ref={trackRef}>
        {groups.map((group, index) => (
          <Fragment key={group[0]}>
            {index > 0 && (
              <div className={styles.paginationPagesEllipsis}>
                <MoreHorizontal />
              </div>
            )}
            {group.map((page) => (
              <Button
                key={page}
                className={styles.paginationPagesSlot}
                text={String(page)}
                onClick={() => onNavigate(page)}
                {...shared}
                variant={page === currentPage ? 'shaded' : 'ghost'}
                intent={page === currentPage ? 'primary' : 'secondary'}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <Button
        icon={<ArrowRight />}
        disabled={currentPage === lastPage}
        onClick={() => onNavigate(currentPage + 1)}
        {...shared}
      />
    </nav>
  );
};

export default Pagination;
