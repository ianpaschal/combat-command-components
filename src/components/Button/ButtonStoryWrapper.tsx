import { Button, ButtonProps } from './Button';

import styles from './ButtonStoryWrapper.module.scss';

const VARIANTS = ['primary', 'secondary', 'outlined', 'ghost'] as const;
const INTENTS = ['default', 'danger', 'warning', 'success', 'info'] as const;

export const ButtonStoryWrapper = (
  props: ButtonProps,
): JSX.Element => (
  <div className={styles.ButtonStoryWrapper}>
    <div className={styles.ButtonStoryWrapper_LabelsX}>
      <h2 className={styles.ButtonStoryWrapper_LabelHeader}>
        Variant
      </h2>
      {VARIANTS.map((variant) => (
        <span className={styles.ButtonStoryWrapper_Label}>
          {variant}
        </span>
      ))}
    </div>
    <div className={styles.ButtonStoryWrapper_LabelsY}>
      <h2 className={styles.ButtonStoryWrapper_LabelHeader}>
        Intent
      </h2>
      {INTENTS.map((intent) => (
        <span className={styles.ButtonStoryWrapper_Label}>
          {intent}
        </span>
      ))}
    </div>
    <div className={styles.ButtonStoryWrapper_Buttons}>
      {INTENTS.map((intent) => (
        VARIANTS.map((variant) => (
          <Button {...props} variant={variant} intent={intent} />
        ))
      ))}
    </div>
  </div>
);
