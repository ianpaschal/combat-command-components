import { cleanup, render } from '@testing-library/react';
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ChartLegend, ChartLegendSeries } from './ChartLegend';

const SERIES: ChartLegendSeries[] = [
  { key: 'attacker', color: 'blue', label: 'Attacker' },
  { key: 'defender', color: 'orange', label: 'Defender' },
];

describe('ChartLegend', () => {
  afterEach(() => {
    cleanup();
  });

  it('names each series in order, next to its color.', () => {
    const { container } = render(<ChartLegend series={SERIES} />);
    const items = [...container.querySelectorAll('li')];
    expect(items.map((item) => item.textContent)).toEqual(['Attacker', 'Defender']);
    expect(items.map((item) => (item.firstElementChild as HTMLElement).style.backgroundColor)).toEqual([
      'blue',
      'orange',
    ]);
  });

  it('shows nothing for a single series.', () => {
    const { container } = render(<ChartLegend series={SERIES.slice(0, 1)} />);
    expect(container.childElementCount).toBe(0);
  });
});
