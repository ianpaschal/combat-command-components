import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getItemPressedStyle,
  getRootStyle,
  getSpacerStyle,
} from './ToggleGroup.utils';

describe('getRootStyle', () => {
  it('leaves both grid template properties undefined when equal is false.', () => {
    expect(getRootStyle(false, 'horizontal', 3)).toEqual({
      gridTemplateColumns: undefined,
      gridTemplateRows: undefined,
    });
  });

  it('builds a column template with a track per option when horizontal and equal.', () => {
    expect(getRootStyle(true, 'horizontal', 3)).toEqual({
      gridTemplateColumns: '1fr var(--toggle-group-spacer-size, 0px) 1fr var(--toggle-group-spacer-size, 0px) 1fr',
      gridTemplateRows: undefined,
    });
  });

  it('builds a row template with a track per option when vertical and equal.', () => {
    expect(getRootStyle(true, 'vertical', 2)).toEqual({
      gridTemplateColumns: undefined,
      gridTemplateRows: '1fr var(--toggle-group-spacer-size, 0px) 1fr',
    });
  });
});

describe('getSpacerStyle', () => {
  it('resolves both the unpressed and pressed color sets.', () => {
    expect(getSpacerStyle('shaded', 'solid', 'primary')).toEqual({
      '--toggle-group-spacer-border-color': 'var(--color-shaded-primary-border)',
      '--toggle-group-spacer-background-color': 'var(--color-shaded-primary-bg)',
      '--toggle-group-spacer-active-border-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-spacer-active-background-color': 'var(--color-solid-primary-bg)',
    });
  });

  it('uses the background color as the border color for the solid variant.', () => {
    expect(getSpacerStyle('solid', 'solid', 'primary')).toEqual({
      '--toggle-group-spacer-border-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-spacer-background-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-spacer-active-border-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-spacer-active-background-color': 'var(--color-solid-primary-bg)',
    });
  });

  it('uses the dedicated border color for the ghost variant.', () => {
    expect(getSpacerStyle('ghost', 'ghost', 'danger')).toEqual({
      '--toggle-group-spacer-border-color': 'var(--color-ghost-danger-border)',
      '--toggle-group-spacer-background-color': 'var(--color-ghost-danger-bg)',
      '--toggle-group-spacer-active-border-color': 'var(--color-ghost-danger-border)',
      '--toggle-group-spacer-active-background-color': 'var(--color-ghost-danger-bg)',
    });
  });

  it('uses the fixed, intent-independent card colors for the surface variant.', () => {
    expect(getSpacerStyle('surface', 'surface', 'primary')).toEqual({
      '--toggle-group-spacer-border-color': 'var(--color-card-border)',
      '--toggle-group-spacer-background-color': 'var(--color-card-bg)',
      '--toggle-group-spacer-active-border-color': 'var(--color-card-border)',
      '--toggle-group-spacer-active-background-color': 'var(--color-card-bg)',
    });
  });
});

describe('getItemPressedStyle', () => {
  it('resolves the pressed border, background, and text color for the solid variant.', () => {
    expect(getItemPressedStyle('solid', 'primary')).toEqual({
      '--toggle-group-item-pressed-border-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-item-pressed-background-color': 'var(--color-solid-primary-bg)',
      '--toggle-group-item-pressed-color': 'var(--color-solid-primary-text)',
    });
  });

  it('omits the text color for the surface variant, which has none.', () => {
    expect(getItemPressedStyle('surface', 'primary')).toEqual({
      '--toggle-group-item-pressed-border-color': 'var(--color-card-border)',
      '--toggle-group-item-pressed-background-color': 'var(--color-card-bg)',
      '--toggle-group-item-pressed-color': undefined,
    });
  });
});
