import { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/style/index.scss';
import './preview.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story, { parameters, viewMode }) => {
      useEffect(() => {
        if (viewMode !== 'story') return;
        const bg: string | undefined = parameters.bodyBackground;
        if (bg) {
          document.body.style.backgroundColor = bg;
          return () => {
            document.body.style.backgroundColor = '';
          };
        }
      }, [parameters.bodyBackground, viewMode]);
      return <Story />;
    },
  ],
  parameters: {
    bodyBackground: 'var(--default-bg)',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
