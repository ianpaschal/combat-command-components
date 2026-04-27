import {
  isGroup,
  MenuGroup,
  MenuItem,
  SingleMenuItem,
} from './Menu.types';

export const normalizeMenuItems = (items: MenuItem[]): MenuGroup[] => {
  const result: MenuGroup[] = [];
  let buffer: SingleMenuItem[] = [];
  const flush = (): void => {
    if (buffer.length > 0) {
      result.push({ items: buffer });
      buffer = [];
    }
  };
  for (const item of items) {
    if (isGroup(item)) {
      flush();
      result.push(item);
    } else {
      buffer.push(item);
    }
  }
  flush();
  return result;
};
