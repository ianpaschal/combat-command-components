import { Dialog } from './Dialog';
import { useDialogsState } from './DialogProvider.hooks';

export const DialogRenderer = (): JSX.Element | null => {
  const [props, ...nested] = useDialogsState();
  if (!props) {
    return null;
  }
  return <Dialog {...props} nested={nested} />;
};
