import { Store } from '@tanstack/store';
import deepmerge from 'deepmerge';

import { dark } from './themes/dark';
import { daybreak } from './themes/daybreak';
import { light } from './themes/light';
import { midnight } from './themes/midnight';
import { DeepPartial } from '../../types';
import { Theme, ThemeRegistryEntry } from './ThemeProvider.types';
import { buildThemeVars } from './ThemeProvider.utils';

export const THEME_STORAGE_KEY = 'cc-theme';

const makeEntry = (theme: Theme): ThemeRegistryEntry => ({
  theme,
  vars: buildThemeVars(theme),
});

export const themeStore = new Store<Record<string, ThemeRegistryEntry>>({
  light: makeEntry(light),
  dark: makeEntry(dark),
  daybreak: makeEntry(daybreak),
  midnight: makeEntry(midnight),
});

export const registerTheme = (key: string, theme: DeepPartial<Theme>, parentKey?: string): void => {
  themeStore.setState((state) => {
    const parent = parentKey ? (state[parentKey]?.theme ?? light) : light;
    const merged = deepmerge(parent, theme as Theme);
    return { ...state, [key]: makeEntry(merged) };
  });
};

export const getRegisteredTheme = (key: string): Theme => {
  const entry = themeStore.state[key];
  if (!entry) {
    console.warn(`Could not find a theme with key ${key}. Will use 'light' instead.`);
    return light;
  }
  return entry.theme;
};

export const getThemeStyleSheet = (): string => {
  const css = Object.entries(themeStore.state).map(([key, { vars }]) => {
    const declarations = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    return `:root[data-theme="${key}"] {\n${declarations}\n}`;
  }).join('\n\n');

  if (typeof document !== 'undefined') {
    const existing = document.querySelector('style[data-theme-vars]');
    if (existing) {
      existing.textContent = css;
    } else {
      const style = document.createElement('style');
      style.setAttribute('data-theme-vars', '');
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  return css;
};

export const injectThemePreflight = (defaults?: { dark?: string; light?: string }): string => {
  const dark = defaults?.dark ?? 'dark';
  const light = defaults?.light ?? 'light';
  return (
    '(function(){' +
    'function a(){' +
    `var k=localStorage.getItem('${THEME_STORAGE_KEY}')||'__system';` +
    `if(k==='__system'){k=window.matchMedia('(prefers-color-scheme: dark)').matches?'${dark}':'${light}';}` +
    'document.documentElement.setAttribute(\'data-theme\',k);' +
    '}' +
    'a();' +
    'new MutationObserver(function(ms){ms.forEach(function(m){' +
    'if(m.attributeName===\'data-theme\'&&!document.documentElement.getAttribute(\'data-theme\'))a();' +
    '});}).observe(document.documentElement,{attributes:true,attributeFilter:[\'data-theme\']});' +
    '})();'
  );
};
