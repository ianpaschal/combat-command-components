import { useStore } from '@tanstack/react-store';

import { Dialog } from './Dialog';
import { dialogStore } from './DialogProvider.store';

export const DialogProvider = (): JSX.Element | null => {
  const [props, ...nested] = useStore(dialogStore);
  if (!props) {
    return null;
  }
  return (
    <Dialog {...props} nested={nested} />
  );
};
