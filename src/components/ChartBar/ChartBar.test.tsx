import { cleanup, render } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  getTooltip,
  hover,
  mockElementSize,
} from '../Chart/Chart.testUtils';
import {
  ChartBar,
  ChartBarDatum,
  ChartBarSeries,
} from './ChartBar';

const SERIES: ChartBarSeries[] = [
  { key: 'attacker', color: 'blue', label: 'Attacker' },
  { key: 'defender', color: 'orange', label: 'Defender' },
];

const DATA: ChartBarDatum[] = [
  { x: 'Germany', values: { attacker: 60, defender: 40 } },
  { x: 'Italy', values: { attacker: 45, defender: 55 } },
];

const getPlot = (container: HTMLElement): Element => container.querySelector('[class*="chartPlotSvg"]')!.parentElement!;

const getBars = (container: HTMLElement): Element[] => [...container.querySelectorAll('[class*="chartBarBar"]')];

/* The plot is mocked at 400 by 300 pixels, so with two categories, the first
 * is centered at 100 pixels and the second at 300 pixels along the category
 * axis.
 */
describe('ChartBar', () => {
  beforeEach(() => {
    mockElementSize(400, 300);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('draws a bar per series in each category.', () => {
    const { container } = render(<ChartBar data={DATA} series={SERIES} />);
    expect(getBars(container)).toHaveLength(4);
  });

  it('selects the category nearest the pointer, fading the other categories\' bars.', () => {
    const { container } = render(<ChartBar data={DATA} series={SERIES} />);
    hover(getPlot(container), 280, 0);
    expect(getBars(container).map((bar) => bar.hasAttribute('data-dimmed'))).toEqual([true, true, false, false]);
  });

  it('shows every series\' value in the tooltip, in series order.', () => {
    const { container } = render(<ChartBar data={DATA} formatValue={(value) => `${value}%`} series={SERIES} />);
    hover(getPlot(container), 90, 0);
    expect(getTooltip()?.textContent).toBe('GermanyAttacker60%Defender40%');
  });

  it('lists vertical stacked series from top to bottom.', () => {
    const { container } = render(<ChartBar data={DATA} mode="stacked" series={SERIES} />);
    hover(getPlot(container), 90, 0);
    expect(getTooltip()?.textContent).toBe('GermanyDefender40Attacker60');
  });

  it('lists horizontal stacked series from left to right.', () => {
    const { container } = render(
      <ChartBar data={DATA} mode="stacked" orientation="horizontal" series={SERIES} />,
    );
    hover(getPlot(container), 0, 220);
    expect(getTooltip()?.textContent).toBe('ItalyAttacker45Defender55');
  });

  it('draws stacked bars end to end, with a gap between them.', () => {
    const { container } = render(
      <ChartBar
        data={DATA}
        mode="stacked"
        orientation="horizontal"
        series={SERIES}
        spacing={4}
        valueTicks={[0, 100]}
      />,
    );
    const [attacker, defender] = getBars(container);
    expect(Number(attacker.getAttribute('width'))).toBe(238);
    expect(Number(defender.getAttribute('x'))).toBe(242);
  });
});
