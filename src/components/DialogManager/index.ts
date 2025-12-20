export {
  type DialogProps,
} from './Dialog';
export {
  useDialog,
} from './Dialog.hooks';
export {
  DialogManager,
  type DialogManagerProps,
  DialogManager as DialogProvider, // FIXME: REMOVE NEXT MAJOR
  type DialogManagerProps as DialogProviderProps, // FIXME: REMOVE NEXT MAJOR
} from './DialogManager';
export {
  useDialogManager,
  useDialogProvider, // FIXME: REMOVE NEXT MAJOR
  useDialogsState,
} from './DialogManager.hooks';
