import type { Preview } from '@storybook/react';

import { SYSTEM_THEME_KEY, ThemeProvider } from '../src/components/ThemeProvider';

import '../src/style/index.scss';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: SYSTEM_THEME_KEY,
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: SYSTEM_THEME_KEY, title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          // { value: 'forest', title: 'Forest' },
          // { value: 'midnight', title: 'Midnight' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const bodyBackground = context.parameters.bodyBackground as string | undefined;
      return (
        <ThemeProvider theme={(context.globals.theme as string) ?? SYSTEM_THEME_KEY}>
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
