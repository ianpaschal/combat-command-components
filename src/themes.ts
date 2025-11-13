import {
  amber,
  amberA,
  amberDark,
  amberDarkA,
  blackA,
  blue,
  blueA,
  blueDark,
  blueDarkA,
  grass,
  grassA,
  grassDark,
  grassDarkA,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  red,
  redA,
  redDark,
  redDarkA,
  tomato,
  tomatoA,
  tomatoDark,
  tomatoDarkA,
} from '@radix-ui/colors';

export const variables = {
  appBarHeight: 64,
  borderWidth: 1,
  text: {
    normal: {
      fontSize: '1rem',
      lineHeight: '1.25rem',
      '@media (width >= 480px)': {
        fontSize: '0.875rem',
        lineHeight: '1.125rem',
      },
    },
  },
};

export type ThemeIntent = 'default' | 'error' | 'info' | 'muted' | 'success' | 'warning';

export type ThemeColor = Record<ThemeIntent, string>;

export type ThemeSide = 'top' | 'bottom' | 'left' | 'right';
export type Theme = {
  text: ThemeColor;
  border: ThemeColor;
  surfaceBackground: {
    default: 'white',
  }
  backdrop: string;
};

export const light: Theme = {
  text: {
    default: gray.gray9,
    error: gray.gray10,
    info: 'blue',
    muted: grayA.grayA1,
    success: 'green',
    warning: 'yellow',
  },
  border: {
    default: grayA.grayA3,
    error: redA.redA3,
    info: 'blue',
    muted: grayA.grayA1,
    success: 'green',
    warning: 'yellow',
  },
  surfaceBackground: {
    default: 'white',
  },
  backdrop: blackA.blackA10,
};

export const dark: Theme = {
  text: {
    default: gray.gray9,
    error: gray.gray10,
    info: 'blue',
    muted: grayA.grayA1,
    success: 'green',
    warning: 'yellow',
  },
  border: {
    default: grayA.grayA3,
    error: redA.redA3,
    info: 'blue',
    muted: grayA.grayA1,
    success: 'green',
    warning: 'yellow',
  },
  surfaceBackground: {
    default: 'white',
  },
  backdrop: blackA.blackA10,
};
