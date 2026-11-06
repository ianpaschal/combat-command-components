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
  tap,
} from '../Chart/Chart.testUtils';
import { ChartPieSlice } from '../ChartPie/ChartPie.types';
import { ChartRatio } from './ChartRatio';

const OUTCOMES: ChartPieSlice[] = [
  { key: 'win', color: 'blue', label: 'Wins', value: 60 },
  { key: 'draw', color: 'grey', label: 'Draws', value: 10 },
  { key: 'loss', color: 'orange', label: 'Losses', value: 30 },
];

const getSegments = (container: HTMLElement): Element[] => (
  [...container.querySelectorAll('[class*="chartRatioSegment"]')]
);

describe('ChartRatio', () => {
  beforeEach(() => {
    mockElementSize(400, 24);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('splits the bar between the segments by their share, with gaps between them.', () => {
    const { container } = render(<ChartRatio data={OUTCOMES} spacing={4} />);
    const widths = getSegments(container).map((segment) => Number(segment.getAttribute('width')));
    expect(widths).toEqual([238, 36, 118]);
  });

  it('fades the other segments while one is selected.', () => {
    const { container } = render(<ChartRatio data={OUTCOMES} />);
    tap(getSegments(container)[2]);
    expect(getSegments(container).map((segment) => segment.hasAttribute('data-dimmed'))).toEqual([true, true, false]);
  });

  it('shows the hovered segment\'s value and share.', () => {
    const { container } = render(<ChartRatio data={OUTCOMES} />);
    hover(getSegments(container)[0]);
    expect(getTooltip()?.textContent).toBe('Wins6060%');
  });

  it('fills the rest of the bar with a remainder.', () => {
    const { container } = render(<ChartRatio data={OUTCOMES} fill={0.5} remainderColor="silver" spacing={0} />);
    const remainder = container.querySelector('[class*="chartRatioRemainder"]');
    expect(Number(remainder?.getAttribute('x'))).toBe(200);
    expect(Number(remainder?.getAttribute('width'))).toBe(200);
  });

  it('takes its height from its thickness.', () => {
    const { container } = render(<ChartRatio data={OUTCOMES} thickness={12} />);
    expect((container.firstElementChild as HTMLElement).style.height).toBe('12px');
  });
});
