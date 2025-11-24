import { Button, ButtonProps } from './Button';

import styles from './ButtonStoryWrapper.module.scss';

const VARIANTS = ['primary', 'secondary', 'outlined', 'ghost'] as const;
const INTENTS = ['neutral', 'danger', 'warning', 'success', 'info'] as const;

export const ButtonStoryWrapper = (
  props: ButtonProps,
): JSX.Element => (
  <div className={styles.buttonStoryWrapper}>
    <div className={styles.buttonStoryWrapperLabelsX}>
      <h2 className={styles.buttonStoryWrapperLabelHeader}>
        Variant
      </h2>
      {VARIANTS.map((variant) => (
        <span className={styles.buttonStoryWrapperLabel}>
          {variant}
        </span>
      ))}
    </div>
    <div className={styles.buttonStoryWrapperLabelsY}>
      <h2 className={styles.buttonStoryWrapperLabelHeader}>
        Intent
      </h2>
      {INTENTS.map((intent) => (
        <span className={styles.buttonStoryWrapperLabel}>
          {intent}
        </span>
      ))}
    </div>
    <div className={styles.buttonStoryWrapperButtons}>
      {INTENTS.map((intent) => (
        VARIANTS.map((variant) => (
          <Button {...props} variant={variant} intent={intent} />
        ))
      ))}
    </div>
  </div>
);
