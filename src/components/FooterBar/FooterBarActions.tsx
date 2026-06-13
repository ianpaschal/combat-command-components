import { ReactElement } from 'react';

import { Button, ButtonProps } from '../Button';

import styles from './FooterBarActions.module.scss';

export interface FooterBarActionsProps {
  left?: ButtonProps[];
  mobile?: boolean;
  right?: ButtonProps[];
}

export const FooterBarActions = ({
  left,
  mobile = false,
  right,
}: FooterBarActionsProps): ReactElement => {
  const renderAction = (action: ButtonProps, index: number) => (
    <Button
      {...action}
      key={index}
      rounded={mobile || action.rounded}
      size={mobile ? 'large' : action.size}
      text={mobile ? undefined : action.text}
    />
  );

  return (
    <div className={styles.footerBarActions} data-mobile={mobile || undefined}>
      <div className={styles.footerBarActionsGroup}>
        {left?.map(renderAction)}
      </div>
      <div className={styles.footerBarActionsGroup}>
        {right?.map(renderAction)}
      </div>
    </div>
  );
};
