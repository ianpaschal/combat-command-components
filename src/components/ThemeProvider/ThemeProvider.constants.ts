import { ThemeMode } from './ThemeProvider.types';

export const THEME_STORAGE_KEY = 'cc-theme';
export const THEME_MODE_STORAGE_KEY = 'cc-theme-mode';
export const SYSTEM_THEME_KEY = '__system';

const VALID_THEME_KEY = /^[a-zA-Z0-9_-]+$/;

export const validateKey = (key: string, context: string): void => {
  if (!VALID_THEME_KEY.test(key)) {
    throw new Error(`Invalid theme key "${key}" (${context}). Keys must contain only letters, numbers, hyphens, and underscores.`);
  }
};

/**
 * Maps a theme key from before `key` and `mode` were split apart to its
 * current `{ key, mode }` pair, so an existing user's `localStorage` value
 * keeps resolving correctly.
 */
export const LEGACY_THEME_KEY_ALIASES: Record<string, { key: string; mode: ThemeMode }> = {
  light: { key: 'classic', mode: 'light' },
  dark: { key: 'classic', mode: 'dark' },
  daybreak: { key: 'storm', mode: 'light' },
  midnight: { key: 'storm', mode: 'dark' },
};

/**
 * Decodes a value from the pre-split single-key `localStorage` slot into a
 * `{ key, mode }` pair. Used once, when reading the very first stored theme
 * preference before the two-slot format existed.
 */
export const decodeLegacyThemeValue = (value: string | null): { key: string; mode: ThemeMode } => {
  if (!value || value === SYSTEM_THEME_KEY) {
    return { key: 'storm', mode: SYSTEM_THEME_KEY };
  }
  return LEGACY_THEME_KEY_ALIASES[value] ?? { key: 'storm', mode: SYSTEM_THEME_KEY };
};
