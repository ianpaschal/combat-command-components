import Color from 'colorjs.io';

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

export const INTENTS = ['accent', 'neutral', 'danger', 'warning', 'success', 'info'] as const;

export const buildThemeVars = (theme: Theme): Record<string, string> => {
  const vars: Record<string, string> = {
    '--overlay-strength': String(theme.overlayStrength),
    '--shadow-strength': String(theme.shadowStrength),
    '--color-header-text': theme.text.header,
    '--color-ui-text': theme.text.ui,
    '--color-body-text': theme.text.body,
    '--color-page-bg': theme.surface.page.bg,
    '--color-card-bg': theme.surface.card.bg,
    '--color-card-border': theme.surface.card.border,
  };

  for (const intent of INTENTS) {
    const { bg, text, focus } = theme.intents[intent];

    // Make the alpha increases on hover more strong (up to 0.10 more) for lighter colors:
    const offset = (new Color(bg).to('oklch').coords[0] ?? 0) * 0.05;

    Object.assign(vars, {

      // Solid
      [`--solid-${intent}-bg`]: bg,
      [`--solid-${intent}-bg-hover`]: shift(bg, 0.35),
      [`--solid-${intent}-bg-active`]: shift(bg, 0.60),
      [`--solid-${intent}-text`]: text,
      [`--solid-${intent}-text-hover`]: text,
      [`--solid-${intent}-text-active`]: text,
      [`--solid-${intent}-border`]: bg,
      [`--solid-${intent}-border-hover`]: shift(bg, 0.35),
      [`--solid-${intent}-border-active`]: shift(bg, 0.60),
      [`--solid-${intent}-focus-outline`]: alpha(focus ?? bg, 0.65),

      // Shaded
      [`--shaded-${intent}-bg`]: alpha(bg, 0.15 + offset),
      [`--shaded-${intent}-bg-hover`]: alpha(bg, 0.30 + offset),
      [`--shaded-${intent}-bg-active`]: alpha(bg, 0.45 + offset),
      [`--shaded-${intent}-text`]: bg,
      [`--shaded-${intent}-text-hover`]: bg,
      [`--shaded-${intent}-text-active`]: bg,
      [`--shaded-${intent}-border`]: alpha(bg, 0.35 + offset),
      [`--shaded-${intent}-border-hover`]: alpha(bg, 0.55 + offset),
      [`--shaded-${intent}-border-active`]: alpha(bg, 0.75 + offset),
      [`--shaded-${intent}-focus-outline`]: alpha(focus ?? bg, 0.55),

      // Ghost
      [`--ghost-${intent}-bg`]: 'transparent',
      [`--ghost-${intent}-bg-hover`]: alpha(bg, 0.05 + offset),
      [`--ghost-${intent}-bg-active`]: alpha(bg, 0.15 + offset),
      [`--ghost-${intent}-text`]: bg,
      [`--ghost-${intent}-text-hover`]: bg,
      [`--ghost-${intent}-text-active`]: bg,
      [`--ghost-${intent}-border`]: alpha(bg, 0.15 + offset),
      [`--ghost-${intent}-border-hover`]: alpha(bg, 0.25 + offset),
      [`--ghost-${intent}-border-active`]: alpha(bg, 0.35 + offset),
      [`--ghost-${intent}-focus-outline`]: alpha(focus ?? bg, 0.45),
    });
  }

  return vars;
};
