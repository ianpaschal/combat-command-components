import type { Preview } from '@storybook/react';

import { SYSTEM_THEME_KEY, ThemeProvider } from '../src/components/ThemeProvider';
import type { ThemeMode } from '../src/components/ThemeProvider';

import '../src/style/index.scss';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    themeKey: {
      description: 'Theme family',
      defaultValue: 'storm',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'classic', title: 'Classic' },
          { value: 'storm', title: 'Storm' },
        ],
        dynamicTitle: true,
      },
    },
    themeMode: {
      description: 'Theme mode',
      defaultValue: SYSTEM_THEME_KEY,
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: SYSTEM_THEME_KEY, title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const bodyBackground = context.parameters.bodyBackground as string | undefined;
      return (
        <ThemeProvider
          themeKey={(context.globals.themeKey as string) ?? 'storm'}
          themeMode={(context.globals.themeMode as ThemeMode) ?? SYSTEM_THEME_KEY}
        >
          {bodyBackground && <style>{`body { background-color: ${bodyBackground}; }`}</style>}
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
};

export default preview;
