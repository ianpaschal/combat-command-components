import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { StatBlock } from './StatBlock';

/* NumberFlow's custom element doesn't run in jsdom. */
vi.mock('@number-flow/react', () => ({ default: () => null }));

describe('StatBlock', () => {
  afterEach(() => {
    cleanup();
  });

  it('names itself with its label and formatted value.', () => {
    render(<StatBlock label="Win Rate" value={0.54} format={{ style: 'percent' }} />);
    expect(screen.getByRole('img', { name: 'Win Rate: 54%' })).toBeTruthy();
  });

  it('adds the suffix to the value in its name.', () => {
    render(<StatBlock label="Games" value={1200} suffix=" played" />);
    expect(screen.getByRole('img', { name: `Games: ${(1200).toLocaleString()} played` })).toBeTruthy();
  });
});
