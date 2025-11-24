import styles from './Spinner.module.scss';

export interface SpinnerProps {
  size: number;
}

/**
 * It would be great to use Lucide's <LoadingSpinner/> SVG, but alas, it looks garbage on Safari.
 */
export const Spinner = ({
  size = 24,
}: SpinnerProps): JSX.Element => (
  <div
    className={styles.spinner}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderWidth: `${Math.max(1.5, size / 12)}px`,
    }}
  />
);
