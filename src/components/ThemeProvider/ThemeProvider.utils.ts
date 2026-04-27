import Color from 'colorjs.io';

import { ElementIntent, ThemeColor } from '../../types';
import { Theme } from './ThemeProvider.types';

export const shift = (color: string, value: number): string => {
  const c = new Color(color).to('oklch');
  const lightness = c.coords[0] ?? 0;
  const delta = value * (1 - lightness);
  c.coords[0] = lightness > 0.5 ? Math.max(0, lightness - delta) : Math.min(1, lightness + delta);
  return c.to('srgb').toString({ format: 'hex' }).toUpperCase();
};

export const alpha = (color: string, value: number): string => {
  const c = new Color(color).to('srgb');
  c.alpha = value;
  return c.toString({ format: 'hex' }).toUpperCase();
};

export const intentColorMap: Record<ElementIntent, ThemeColor> = {
  primary: 'accent',
  secondary: 'neutral',
  danger: 'red',
  warning: 'yellow',
  success: 'green',
  info: 'blue',
};

export const buildThemeVars = (theme: Theme): Record<string, string> => {
  const vars: Record<string, string> = {
    '--color-card-bg': theme.surface.card.bg,
    '--color-card-border': theme.surface.card.border,
    '--color-page-bg': theme.surface.page.bg,
    '--color-text-body': theme.text.body,
    '--color-text-header': theme.text.header,
    '--color-text-muted': theme.text.muted,
    '--color-text-ui': theme.text.ui,
    '--overlay-strength': String(theme.overlayStrength),
    '--shadow-strength': String(theme.shadowStrength),
    '--scroll-indicator-shadow': `rgb(0 0 0 / ${theme.shadowStrength * 0.8})`,
    '--modal-backdrop-bg': `rgb(0 0 0 / ${theme.overlayStrength})`,
    '--modal-backdrop-nested-bg': `rgb(0 0 0 / ${theme.overlayStrength * 0.5})`,
  };

  for (const [color, { bg, text }] of Object.entries(theme.colors)) {
    Object.assign(vars, {
      [`--color-${color}-bg`]: bg,
      [`--color-${color}-text`]: text,
    });
  }

  for (const [intent, color] of Object.entries(intentColorMap)) {
    const { bg, text, focus } = theme.colors[color];

    // Make the alpha increases on hover more strong for lighter colors:
    const offset = (new Color(bg).to('oklch').coords[0] ?? 0) * 0.2;

    Object.assign(vars, {

      // Solid
      [`--color-solid-${intent}-bg`]: bg,
      [`--color-solid-${intent}-bg-hover`]: shift(bg, 0.35),
      [`--color-solid-${intent}-bg-active`]: shift(bg, 0.60),
      [`--color-solid-${intent}-text`]: text,
      [`--color-solid-${intent}-text-hover`]: text,
      [`--color-solid-${intent}-text-active`]: text,
      [`--color-solid-${intent}-border`]: bg,
      [`--color-solid-${intent}-border-hover`]: shift(bg, 0.35),
      [`--color-solid-${intent}-border-active`]: shift(bg, 0.60),
      [`--color-solid-${intent}-focus-outline`]: alpha(focus ?? bg, 0.65),

      // Shaded
      [`--color-shaded-${intent}-bg`]: alpha(bg, 0.10 + offset),
      [`--color-shaded-${intent}-bg-hover`]: alpha(bg, 0.25 + offset),
      [`--color-shaded-${intent}-bg-active`]: alpha(bg, 0.40 + offset),
      [`--color-shaded-${intent}-text`]: bg,
      [`--color-shaded-${intent}-text-hover`]: bg,
      [`--color-shaded-${intent}-text-active`]: bg,
      [`--color-shaded-${intent}-border`]: alpha(bg, 0.40 + offset),
      [`--color-shaded-${intent}-border-hover`]: alpha(bg, 0.55 + offset),
      [`--color-shaded-${intent}-border-active`]: alpha(bg, 0.70 + offset),
      [`--color-shaded-${intent}-focus-outline`]: alpha(focus ?? bg, 0.55),

      // Ghost
      [`--color-ghost-${intent}-bg`]: 'transparent',
      [`--color-ghost-${intent}-bg-hover`]: alpha(bg, offset),
      [`--color-ghost-${intent}-bg-active`]: alpha(bg, 0.05 + offset),
      [`--color-ghost-${intent}-text`]: bg,
      [`--color-ghost-${intent}-text-hover`]: bg,
      [`--color-ghost-${intent}-text-active`]: bg,
      [`--color-ghost-${intent}-border`]: alpha(bg, 0.05 + offset),
      [`--color-ghost-${intent}-border-hover`]: alpha(bg, 0.10 + offset),
      [`--color-ghost-${intent}-border-active`]: alpha(bg, 0.15 + offset),
      [`--color-ghost-${intent}-focus-outline`]: alpha(focus ?? bg, 0.45),
    });
  }

  return vars;
};
