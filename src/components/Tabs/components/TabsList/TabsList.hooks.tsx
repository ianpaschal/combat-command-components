import {
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';

import { FooterBar } from '../../../FooterBar';

export const useAsFooter = (
  asFooter: boolean,
  maxWidth: number | string | undefined,
) => useCallback((children: ReactNode): ReactElement => {
  if (asFooter) {
    return (
      <FooterBar maxWidth={maxWidth}>
        {children}
      </FooterBar>
    );
  }
  return <>{children}</>;
}, [asFooter, maxWidth]);
