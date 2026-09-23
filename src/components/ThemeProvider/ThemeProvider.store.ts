import { Store } from '@tanstack/store';
import deepmerge from 'deepmerge';

import { classicDark } from './themes/classic-dark';
import { classicLight } from './themes/classic-light';
import { stormDark } from './themes/storm-dark';
import { stormLight } from './themes/storm-light';
import { DeepPartial } from '../../types';
import {
  LEGACY_THEME_KEY_ALIASES,
  SYSTEM_THEME_KEY,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  validateKey,
} from './ThemeProvider.constants';
import { Theme, ThemeRegistryEntry } from './ThemeProvider.types';
import { buildThemeVars } from './ThemeProvider.utils';

const makeEntry = (theme: Theme): ThemeRegistryEntry => ({
  theme,
  vars: buildThemeVars(theme),
});

type ThemeFamilyEntry = {
  displayName: string;
  light: ThemeRegistryEntry;
  dark: ThemeRegistryEntry;
};

export const themeStore = new Store<Record<string, ThemeFamilyEntry>>({
  classic: { displayName: 'Classic', light: makeEntry(classicLight), dark: makeEntry(classicDark) },
  storm: { displayName: 'Storm', light: makeEntry(stormLight), dark: makeEntry(stormDark) },
});

/**
 * Registers a theme family (both its light and dark variants, plus a display
 * name). Each variant is deep-merged onto the corresponding variant of the
 * parent family (defaults to `"classic"`). CSS variables are computed and
 * cached immediately.
 *
 * @param key - Unique key used to identify and activate the family.
 * @param theme - The family's display name and its two variants; missing
 *   fields on each variant are inherited from the parent.
 * @param parentKey - Key of the family to inherit from. Defaults to `"classic"`.
 */
export const registerTheme = (
  key: string,
  theme: {
    displayName: string;
    light: DeepPartial<Omit<Theme, 'key' | 'dark'>>;
    dark: DeepPartial<Omit<Theme, 'key' | 'dark'>>;
  },
  parentKey = 'classic',
): void => {
  validateKey(key, 'registerTheme');
  themeStore.setState((state) => {
    const parentFamily = state[parentKey];
    if (!parentFamily) {
      console.warn(`registerTheme: parent key "${parentKey}" not found for theme "${key}". Falling back to "classic".`);
    }
    const parent = parentFamily ?? state.classic;
    const mergedLight = deepmerge(parent.light.theme, { ...theme.light, key, dark: false } as Theme);
    const mergedDark = deepmerge(parent.dark.theme, { ...theme.dark, key, dark: true } as Theme);
    return {
      ...state,
      [key]: {
        displayName: theme.displayName,
        light: makeEntry(mergedLight),
        dark: makeEntry(mergedDark),
      },
    };
  });
};

/**
 * Returns the resolved `Theme` object for the given key and mode. Falls back
 * to Storm and logs a warning if the key is not registered.
 *
 * @param key - Key of the registered theme family to retrieve.
 * @param dark - Whether to retrieve the dark or light variant.
 */
export const getRegisteredTheme = (key: string, dark: boolean): Theme => {
  const family = themeStore.state[key];
  if (!family) {
    console.warn(`Could not find a theme with key ${key}. Will use 'storm' instead.`);
    return dark ? stormDark : stormLight;
  }
  return dark ? family.dark.theme : family.light.theme;
};

/**
 * Serializes all registered themes' CSS variables into a single stylesheet
 * string, with each theme scoped to
 * `:root[data-theme-key="<key>"][data-theme-mode="<light|dark>"]`. In a
 * browser context, also injects or updates a `<style data-theme-vars>`
 * element in `<head>` (idempotent).
 *
 * @returns The generated CSS string.
 */
export const getThemeStyleSheet = (): string => {
  const css = Object.entries(themeStore.state).flatMap(([key, family]) => {
    const safeKey = key.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return (['light', 'dark'] as const).map((mode) => {
      const declarations = Object.entries(family[mode].vars).map(([k, v]) => (
        `  ${k}: ${v};`
      )).join('\n');
      return `:root[data-theme-key="${safeKey}"][data-theme-mode="${mode}"] {\n${declarations}\n}`;
    });
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
 * `data-theme-key`/`data-theme-mode` on `<html>` before first paint,
 * preventing a flash of unstyled content. Also installs a `MutationObserver`
 * to re-apply the theme if those attributes are removed (e.g. during Astro
 * page transitions). Drop the returned string into a blocking `<script>` in
 * `<head>`.
 *
 * @param defaults - Optional override for the family key used when nothing is
 *   stored yet. Defaults to `"storm"`.
 */
export const injectThemePreflight = (
  defaults?: { key?: string },
): string => {
  const defaultKey = defaults?.key ?? 'storm';
  validateKey(defaultKey, 'injectThemePreflight defaults.key');
  const aliases = JSON.stringify(LEGACY_THEME_KEY_ALIASES);
  return `
    (() => {
      const aliases = ${aliases};
      const applyTheme = () => {
        var key = null;
        var mode = null;
        try {
          key = localStorage.getItem('${THEME_STORAGE_KEY}');
          mode = localStorage.getItem('${THEME_MODE_STORAGE_KEY}');
        } catch(e) {}
        if (!key || !mode) {
          var legacy = key ? aliases[key] : null;
          key = legacy ? legacy.key : '${defaultKey}';
          mode = legacy ? legacy.mode : '${SYSTEM_THEME_KEY}';
        }
        var dark = mode === '${SYSTEM_THEME_KEY}'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : mode === 'dark';
        document.documentElement.setAttribute('data-theme-key', key);
        document.documentElement.setAttribute('data-theme-mode', dark ? 'dark' : 'light');
      };
      applyTheme();
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if ((mutation.attributeName === 'data-theme-key' || mutation.attributeName === 'data-theme-mode')
            && !document.documentElement.getAttribute('data-theme-key')) {
            applyTheme();
          }
        });
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme-key', 'data-theme-mode'],
      });
    })()
  `;
};
