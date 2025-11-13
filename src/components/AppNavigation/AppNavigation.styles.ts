import { styled } from 'goober';

import { borders } from '../../style/borders';
import { row } from '../../style/flex';
import { textDefault } from '../../style/text';
import { Theme, variables } from '../../themes';

const APP_BAR_LOGO_SIZE = '2.5rem';

type RootProps = {
  theme: Theme;
};
export const Root = styled('div')<RootProps>(({
  theme,
}) => ({
  ...borders(theme, { side: 'bottom' }),
  ...textDefault(theme),
  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 5%)',
  overflow: 'hidden',
  boxSizing: 'border-box',
  width: '100%',
  height: `${variables.appBarHeight}px`,
  padding: `0.75rem 1rem calc(0.75rem - ${variables.borderWidth}px)`,
  backgroundColor: theme.surfaceBackground.default,
}));

export const Content = styled('div')<{ mobile: boolean }>((props) => ({
  display: 'grid',
  gap: '1.5rem',
  alignItems: 'center',
  ...(props.mobile
    ? {
      gridTemplateAreas: '"navigation logo secondary"',
      gridTemplateColumns: `1fr ${APP_BAR_LOGO_SIZE} 1fr`,
      gridTemplateRows: APP_BAR_LOGO_SIZE,
    }
    : {
      gridTemplateAreas: '"logo navigation secondary"',
      gridTemplateColumns: `${APP_BAR_LOGO_SIZE} 1fr auto`,
      gridTemplateRows: APP_BAR_LOGO_SIZE,
    }),
}));

export const Navigation = styled('div')({
  ...row({ xAlign: 'start' }),
  gridArea: 'navigation',
});

export const Logo = styled('div')({
  gridArea: 'logo',
  width: APP_BAR_LOGO_SIZE,
  height: APP_BAR_LOGO_SIZE,
});

export const SecondaryControls = styled('div')({
  ...row({ xAlign: 'end' }),
  gridArea: 'secondary',
});
