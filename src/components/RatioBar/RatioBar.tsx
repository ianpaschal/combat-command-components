import clsx from 'clsx';

import styles from './RatioBar.module.scss';

export type RatioBarSection = {
  value: number;
  color: string;
  label: string;
  onClick?: () => void;
};

export interface RatioBarProps {
  className?: string;
  sections: RatioBarSection[];
  removeEmpty?: boolean;
}

export const RatioBar = ({
  className,
  sections,
  removeEmpty = true,
}: RatioBarProps): JSX.Element => (
  <div className={clsx(styles.ratioBar, className)}>
    {sections.filter(({ value }) => value > 0 || !removeEmpty).map((section, i) => (
      <div
        className={styles.ratioBarSection}
        key={i}
        onClick={section.onClick}
        style={{
          backgroundColor: section.color,
          flex: section.value,
        }}
      />
    ))}
  </div>
);
