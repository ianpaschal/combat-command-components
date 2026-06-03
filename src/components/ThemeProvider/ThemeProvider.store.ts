import { Store } from '@tanstack/store';
import deepmerge from 'deepmerge';

import { dark } from './themes/dark';
import { daybreak } from './themes/daybreak';
import { light } from './themes/light';
import { midnight } from './themes/midnight';
import { DeepPartial } from '../../types';
import {
  SYSTEM_THEME_KEY,
  THEME_STORAGE_KEY,
  validateKey,
} from './ThemeProvider.constants';
import { Theme, ThemeRegistryEntry } from './ThemeProvider.types';
import { buildThemeVars } from './ThemeProvider.utils';

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

/**
 * Registers a new theme or overrides an existing one. The provided theme is
 * deep-merged onto the parent (defaults to `light`). CSS variables are computed
 * and cached immediately.
 *
 * @param key - Unique key used to identify and activate the theme.
 * @param theme - Partial theme object; missing values are inherited from the
 *   parent.
 * @param parentKey - Key of the theme to inherit from. Defaults to `"light"`.
 */
export const registerTheme = (
  key: string,
  theme: DeepPartial<Theme>,
  parentKey?: string,
): void => {
  validateKey(key, 'registerTheme');
  themeStore.setState((state) => {
    if (parentKey && !state[parentKey]) {
      console.warn(`registerTheme: parent key "${parentKey}" not found for theme "${key}". Falling back to "light".`);
    }
    const parent = parentKey ? (state[parentKey]?.theme ?? light) : light;
    const merged = deepmerge(parent, theme as Theme);
    return { ...state, [key]: makeEntry(merged) };
  });
};

/**
 * Returns the resolved `Theme` object for the given key. Falls back to `light`
 * and logs a warning if the key is not registered.
 *
 * @param key - Key of the registered theme to retrieve.
 */
export const getRegisteredTheme = (key: string): Theme => {
  const entry = themeStore.state[key];
  if (!entry) {
    console.warn(`Could not find a theme with key ${key}. Will use 'light' instead.`);
    return light;
  }
  return entry.theme;
};

/**
 * Serializes all registered themes' CSS variables into a single stylesheet
 * string, with each theme scoped to `:root[data-theme="<key>"]`. In a browser
 * context, also injects or updates a `<style data-theme-vars>` element in
 * `<head>` (idempotent).
 *
 * @returns The generated CSS string.
 */
export const getThemeStyleSheet = (): string => {
  const css = Object.entries(themeStore.state).map(([key, { vars }]) => {
    const safeKey = key.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const declarations = Object.entries(vars).map(([k, v]) => (
      `  ${k}: ${v};`
    )).join('\n');
    return `:root[data-theme="${safeKey}"] {\n${declarations}\n}`;
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

/**
 * Returns a self-executing script string that reads `localStorage` and sets
 * `data-theme` on `<html>` before first paint, preventing a flash of unstyled
 * content. Also installs a `MutationObserver` to re-apply the theme if
 * `data-theme` is removed (e.g. during Astro page transitions). Drop the
 * returned string into a blocking `<script>` in `<head>`.
 *
 * @param defaults - Optional overrides for the theme keys used when the stored
 *   value is `SYSTEM_THEME_KEY`. Defaults to `{ dark: "dark", light: "light" }`.
 */
export const injectThemePreflight = (
  defaults?: { dark?: string; light?: string },
): string => {
  const dark = defaults?.dark ?? 'dark';
  validateKey(dark, 'injectThemePreflight defaults.dark');
  const light = defaults?.light ?? 'light';
  validateKey(light, 'injectThemePreflight defaults.light');
  return `
    (() => {
      const applyTheme = () => {
        var key = '${SYSTEM_THEME_KEY}';
        try {
          key = localStorage.getItem('${THEME_STORAGE_KEY}') || '${SYSTEM_THEME_KEY}';
        } catch(e) {}
        if (key === '${SYSTEM_THEME_KEY}') {
          key = window.matchMedia('(prefers-color-scheme: dark)').matches ? '${dark}' : '${light}';
        }
        document.documentElement.setAttribute('data-theme', key);
      };
      applyTheme();
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme' && !document.documentElement.getAttribute('data-theme')) {
            applyTheme();
          }
        });
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    })()
  `;
};
