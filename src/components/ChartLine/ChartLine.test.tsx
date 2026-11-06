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
  ChartLine,
  ChartLineDatum,
  ChartLineSeries,
} from './ChartLine';

const SERIES: ChartLineSeries[] = [
  { key: 'win', color: 'blue', label: 'Wins' },
  { key: 'loss', color: 'orange', label: 'Losses' },
];

const DATA: ChartLineDatum[] = [
  { x: 'JAN', values: { win: 10, loss: 5 } },
  { x: 'FEB', values: { win: 20, loss: 15 } },
  { x: 'MAR', values: { win: 30, loss: 10 } },
];

const getPlot = (container: HTMLElement): Element => container.querySelector('[class*="chartPlotPlot"]')!;

/* The plot is mocked at 400 by 300 pixels, so with three x values as points,
 * they sit at 0, 200 and 400 pixels.
 */
describe('ChartLine', () => {
  beforeEach(() => {
    mockElementSize(400, 300);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('draws a line per series.', () => {
    const { container } = render(<ChartLine data={DATA} fill={false} series={SERIES} />);
    expect(container.querySelectorAll('path[fill="none"]')).toHaveLength(2);
  });

  it('marks the x value nearest the pointer with a line and a dot per series.', () => {
    const { container } = render(<ChartLine data={DATA} series={SERIES} />);
    hover(getPlot(container), 190, 0);
    const highlight = container.querySelector('[class*="chartPlotHighlightLine"]');
    expect(highlight?.getAttribute('x1')).toBe('200');
    expect([...container.querySelectorAll('circle')].map((dot) => dot.getAttribute('cx'))).toEqual(['200', '200']);
  });

  it('shows every series\' value in the tooltip, with the formatted x value.', () => {
    const { container } = render(
      <ChartLine data={DATA} formatCategory={(x) => `${x} 1`} series={SERIES} />,
    );
    hover(getPlot(container), 390, 0);
    expect(getTooltip()?.textContent).toBe('MAR 1Wins30Losses10');
  });

  it('lists stacked series from top to bottom.', () => {
    const { container } = render(<ChartLine data={DATA} mode="stacked" series={SERIES} />);
    hover(getPlot(container), 10, 0);
    expect(getTooltip()?.textContent).toBe('JANLosses5Wins10');
  });

  it('fills the bands between stacked lines.', () => {
    const { container } = render(<ChartLine data={DATA} mode="stacked" series={SERIES} />);
    expect(container.querySelectorAll('path[fill-opacity]')).toHaveLength(2);
  });
});
