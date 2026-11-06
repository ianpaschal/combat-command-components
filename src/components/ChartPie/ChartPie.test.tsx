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
import { ChartPie } from './ChartPie';
import { ChartPieSlice } from './ChartPie.types';

const OUTCOMES: ChartPieSlice[] = [
  { key: 'win', color: 'blue', label: 'Wins', value: 60 },
  { key: 'draw', color: 'grey', label: 'Draws', value: 10 },
  { key: 'loss', color: 'orange', label: 'Losses', value: 30 },
];

const getSlices = (container: HTMLElement): Element[] => (
  [...container.querySelectorAll('[class*="chartPieSlice"]')]
);

describe('ChartPie', () => {
  beforeEach(() => {
    mockElementSize(400, 300);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('draws a slice per item.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} />);
    expect(getSlices(container)).toHaveLength(3);
    expect(getSlices(container).every((slice) => slice.getAttribute('d'))).toBe(true);
  });

  it('fades the other slices while one is hovered.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} />);
    hover(getSlices(container)[1]);
    expect(getSlices(container).map((slice) => slice.hasAttribute('data-dimmed'))).toEqual([true, false, true]);
  });

  it('shows the hovered slice\'s value and share.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} formatValue={(value) => `${value} games`} />);
    hover(getSlices(container)[0]);
    expect(getTooltip()?.textContent).toBe('Wins60 games60%');
  });

  it('lists the slices folded into the "Other" slice.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} otherLabel="Rest" otherThreshold={0.4} />);
    expect(getSlices(container)).toHaveLength(2);
    hover(getSlices(container)[1]);
    expect(getTooltip()?.textContent).toBe('Rest (40%)Draws10 (10%)Losses30 (30%)');
  });

  it('fills the rest of the sweep with a remainder.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} fill={0.5} remainderColor="silver" />);
    expect(container.querySelectorAll('[class*="chartPieRemainder"]')).toHaveLength(1);
  });

  it('leaves out the remainder without a color.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} fill={0.5} />);
    expect(container.querySelectorAll('[class*="chartPieRemainder"]')).toHaveLength(0);
  });

  it('sizes the SVG to the part of the circle it spans.', () => {
    const { container } = render(<ChartPie data={OUTCOMES} origin="left" sweep={0.5} />);
    const svg = container.querySelector('svg');
    expect(Number(svg?.getAttribute('width'))).toBeCloseTo(400);
    expect(Number(svg?.getAttribute('height'))).toBeCloseTo(200);
  });
});
