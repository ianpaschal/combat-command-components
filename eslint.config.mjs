import ianpaschal from '@ianpaschal/eslint-config';

export default [
  {
    ignores: ['dist/**', '.storybook/**'],
  },
  ...ianpaschal,
];
