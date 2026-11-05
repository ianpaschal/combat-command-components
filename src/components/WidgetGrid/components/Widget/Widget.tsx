import {
  ComponentPropsWithoutRef,
  ReactElement,
  useContext,
} from 'react';

import { ElementElevation } from '../../../../types';
import { sx } from '../../../../utils/getStyleClassNames';
import { WidgetGridContext } from '../../WidgetGrid.context';
import { getWidgetStyle, WidgetPosition } from './Widget.utils';

import styles from './Widget.module.scss';

export interface WidgetProps extends ComponentPropsWithoutRef<'div'> {
  elevation?: ElementElevation;
  glass?: boolean;
  positions: Record<number, WidgetPosition>;
}

export const Widget = ({
  children,
  className,
  elevation = 1,
  glass = false,
  positions,
  style,
  ...props
}: WidgetProps): ReactElement | null => {
  const position = positions[useContext(WidgetGridContext)];

  if (!position) {
    return null;
  }

  return (
    <div
      {...props}
      className={sx({
        variant: 'surface',
        glass,
        elevation,
        border: true,
        corners: 'normal',
      }, styles.widget, className)}
      style={{ ...getWidgetStyle(position), ...style }}
    >
      {children}
    </div>
  );
};

Widget.displayName = 'Widget';
