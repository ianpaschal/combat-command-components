import { ComponentProps, useEffect, useState } from 'react';
import { DocsContainer as BaseDocsContainer } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';

const DARK_THEME_KEYS = ['dark', 'midnight'];

const getIsDark = () => (
  DARK_THEME_KEYS.includes(document.documentElement.getAttribute('data-theme') ?? '')
);

export const DocsContainer = (props: ComponentProps<typeof BaseDocsContainer>) => {
  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(getIsDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <BaseDocsContainer {...props} theme={isDark ? themes.dark : themes.light} />
  );
};
