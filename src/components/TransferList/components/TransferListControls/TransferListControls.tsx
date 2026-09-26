import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from 'lucide-react';

import { Button } from '../../../Button';
import { TransferListGroupDef, TransferListOrientation } from '../../TransferList.types';

import styles from './TransferListControls.module.scss';

export interface TransferListControlsProps {
  disabled?: boolean;
  groups: TransferListGroupDef[];
  index: number;
  onMove: (values: string[], groupKey: string) => void;
  orientation?: TransferListOrientation;
  staged: Record<string, string[]>;
}

export const TransferListControls = ({
  disabled = false,
  groups,
  index,
  onMove,
  orientation = 'horizontal',
  staged,
}: TransferListControlsProps): JSX.Element | null => {
  const group = groups[index];
  const nextGroup = groups[index + 1];
  if (!nextGroup) {
    return null;
  }
  const rightChecked = staged[group.key] ?? [];
  const leftChecked = staged[nextGroup.key] ?? [];
  const rightDisabled = disabled || rightChecked.length === 0;
  const leftDisabled = disabled || leftChecked.length === 0;
  return (
    <div className={styles.transferListControls} data-orientation={orientation}>
      <Button
        size="small"
        variant={rightDisabled ? 'ghost' : 'solid'}
        intent={rightDisabled ? 'secondary' : 'primary'}
        border
        aria-label={`Move checked to ${nextGroup.title}`}
        icon={orientation === 'horizontal' ? <ArrowRight /> : <ArrowDown />}
        onClick={() => onMove(rightChecked, nextGroup.key)}
        disabled={rightDisabled}
      />
      <Button
        size="small"
        variant={leftDisabled ? 'ghost' : 'solid'}
        intent={leftDisabled ? 'secondary' : 'primary'}
        border
        aria-label={`Move checked to ${group.title}`}
        icon={orientation === 'horizontal' ? <ArrowLeft /> : <ArrowUp />}
        onClick={() => onMove(leftChecked, group.key)}
        disabled={leftDisabled}
      />
    </div>
  );
};

TransferListControls.displayName = 'TransferListControls';
