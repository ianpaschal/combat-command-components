import { Store } from '@tanstack/store';
import deepmerge from 'deepmerge';

import { dark } from './themes/dark';
import { daybreak } from './themes/daybreak';
import { light } from './themes/light';
import { midnight } from './themes/midnight';
import { DeepPartial } from '../../types';
import { Theme } from './ThemeProvider.types';

export const themeStore = new Store<Record<string, Theme>>({
  light,
  dark,
  daybreak,
  midnight,
});

export const registerTheme = (key: string, theme: DeepPartial<Theme>, parentKey?: string): void => {
  themeStore.setState((state) => {
    const parent = parentKey ? (state[parentKey] ?? light) : light;
    return { ...state, [key]: deepmerge(parent, theme as Theme) };
  });
};

export const getRegisteredTheme = (key: string): Theme => {
  const theme = themeStore.state[key];
  if (!theme) {
    console.warn(`Could not find a theme with key ${key}. Will use 'light' instead.`);
    return light;
  }
  return theme;
};
