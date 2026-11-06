import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ChartTooltipContent } from './components/ChartTooltip';
import { Chart } from './Chart';
import {
  getTooltip,
  hover,
  mockElementSize,
} from './Chart.testUtils';

const TOOLTIP = {
  rows: [{ color: 'red', label: 'Wins', value: '12' }],
  title: 'Germany',
};

const renderChart = (
  getChartTooltip: (key: string) => ChartTooltipContent | undefined = () => TOOLTIP,
) => render(
  <Chart className="custom" getTooltip={getChartTooltip}>
    {({
      activeKey,
      getItemHandlers,
      height,
      width,
    }) => (
      <>
        <span data-testid="size">{`${width}x${height}`}</span>
        <span data-testid="active">{activeKey ?? 'none'}</span>
        <div data-testid="item" {...getItemHandlers('germany')} />
      </>
    )}
  </Chart>,
);

describe('Chart', () => {
  beforeEach(() => {
    mockElementSize(400, 300);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('draws its children at its measured size.', () => {
    renderChart();
    expect(screen.getByTestId('size').textContent).toBe('400x300');
  });

  it('keeps its class name.', () => {
    const { container } = renderChart();
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('passes the selected item to its children.', () => {
    renderChart();
    hover(screen.getByTestId('item'));
    expect(screen.getByTestId('active').textContent).toBe('germany');
  });

  it('shows the selected item\'s tooltip in a portal, at the pointer.', () => {
    const getChartTooltip = vi.fn(() => TOOLTIP);
    renderChart(getChartTooltip);
    hover(screen.getByTestId('item'), 30, 40);
    expect(getChartTooltip).toHaveBeenCalledWith('germany');
    const tooltip = getTooltip();
    expect(tooltip?.textContent).toBe('GermanyWins12');
    expect(tooltip?.style.left).toBe('30px');
    expect(tooltip?.style.top).toBe('40px');
  });

  it('shows no tooltip when nothing is selected.', () => {
    renderChart();
    expect(getTooltip()).toBeNull();
  });

  it('shows no tooltip when the item has none.', () => {
    renderChart(vi.fn(() => undefined));
    hover(screen.getByTestId('item'));
    expect(getTooltip()).toBeNull();
  });
});
