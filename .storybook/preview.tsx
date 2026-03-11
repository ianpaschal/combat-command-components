import { useEffect } from 'react';
import type { Preview } from '@storybook/react';

import '../src/style/index.scss';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story, { parameters }) => {
      useEffect(() => {
        const bg: string | undefined = parameters.bodyBackground;
        if (bg) {
          document.body.style.backgroundColor = bg;
          return () => { document.body.style.backgroundColor = ''; };
        }
      }, [parameters.bodyBackground]);
      return <Story />;
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
