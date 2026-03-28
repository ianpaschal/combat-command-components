import type { Preview } from '@storybook/react';
import { ThemeProvider, light, dark, midnight, Theme } from '../src/components/ThemeProvider';

import '../src/style/index.scss';
import './preview.css';

const themes: Record<string, Theme> = { light, dark, midnight };

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.entries(themes).map(([value, { displayName }]) => ({ value, title: displayName })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = (context.globals.theme as string) ?? 'light';
      const theme = themes[themeName] ?? themes.light;
      const bodyBackground = context.parameters.bodyBackground as string | undefined;
      return (
        <ThemeProvider theme={theme}>
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
  },
};

export default preview;
