import { Dialog } from '@base-ui-components/react/dialog';
import { styled } from 'goober';

import { corners } from '../../../../style/corners';
import { Theme } from '../../../../themes';

type BackdropProps = {
  theme: Theme;
};

export default {
  Trigger: styled(Dialog.Trigger)({
    ...corners(),
  }),
  Backdrop: styled(Dialog.Backdrop)<BackdropProps>(({ theme }) => ({
    position: 'fixed',
    inset: 0,
    backgroundColor: theme.backdrop,
    transition: 'opacity 0.3s ease',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
    },
  })),
};
