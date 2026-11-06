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
} from 'vitest';

import { WidgetGridContext } from '../../WidgetGrid.context';
import { Widget } from './Widget';
import { WidgetPosition } from './Widget.utils';

const POSITIONS: Record<number, WidgetPosition> = {
  4: { from: [1, 1], to: [2, 1] },
};

describe('Widget', () => {
  afterEach(() => {
    cleanup();
  });

  it('takes its position for the current column count.', () => {
    render(
      <WidgetGridContext.Provider value={4}>
        <Widget positions={POSITIONS} data-testid="widget" />
      </WidgetGridContext.Provider>,
    );
    expect(screen.getByTestId('widget').style.gridColumn).toBe('1 / 3');
  });

  it('renders nothing without a position for the current column count.', () => {
    const { container } = render(
      <WidgetGridContext.Provider value={2}>
        <Widget positions={POSITIONS} data-testid="widget" />
      </WidgetGridContext.Provider>,
    );
    expect(container.innerHTML).toBe('');
  });
});
