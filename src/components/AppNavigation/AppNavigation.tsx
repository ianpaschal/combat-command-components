import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { DesktopNavigation } from './components/DesktopNavigation';
import { MobileNavigation } from './components/MobileNavigation';
import { AppLogo } from '../AppLogo';
import { useTheme } from '../ThemeProvider';
import {
  Content,
  Logo,
  Navigation,
  Root,
  SecondaryControls,
} from './AppNavigation.styles';
import { Route, SecondaryRoute } from './AppNavigation.types';

export interface AppNavigationProps {
  className?: string;
  maxWidth?: number | string;
  mobile?: boolean;
  routes: Route[];
  secondaryControls?: ReactElement;
  secondaryRoutes?: SecondaryRoute[];
}

export const AppNavigation = ({
  className,
  maxWidth = '100vw',
  mobile = false,
  routes,
  secondaryControls,
  secondaryRoutes,
}: AppNavigationProps): JSX.Element => {
  const theme = useTheme();
  return createPortal((
    <Root className={className} theme={theme}>
      <Content mobile={mobile} style={{ maxWidth }}>
        <Logo>
          <AppLogo />
        </Logo>
        <Navigation>
          {mobile ? (
            <MobileNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
          ) : (
            <DesktopNavigation routes={routes} secondaryRoutes={secondaryRoutes} />
          )}
        </Navigation>
        {secondaryControls && (
          <SecondaryControls>
            {secondaryControls}
          </SecondaryControls>
        )}
      </Content>
    </Root>
  ), document.body);
};
