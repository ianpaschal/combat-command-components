export const THEME_STORAGE_KEY = 'cc-theme';
export const SYSTEM_THEME_KEY = '__system';

const VALID_THEME_KEY = /^[a-zA-Z0-9_-]+$/;

export const validateKey = (key: string, context: string): void => {
  if (!VALID_THEME_KEY.test(key)) {
    throw new Error(`Invalid theme key "${key}" (${context}). Keys must contain only letters, numbers, hyphens, and underscores.`);
  }
};
