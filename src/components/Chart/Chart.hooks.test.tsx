import { useRef } from 'react';
import {
  act,
  cleanup,
  fireEvent,
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

import { useChartSelection, useElementSize } from './Chart.hooks';
import {
  hover,
  mockElementSize,
  tap,
  unhover,
} from './Chart.testUtils';

const SizeProbe = () => {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  return <div ref={ref} data-testid="size">{`${width}x${height}`}</div>;
};

const SelectionProbe = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { active, getAreaHandlers, getItemHandlers } = useChartSelection(ref);
  return (
    <div ref={ref}>
      <div data-testid="a" {...getItemHandlers('a')} />
      <div data-testid="b" {...getItemHandlers('b')} />
      <div
        data-testid="area"
        {...getAreaHandlers((event) => (event.clientX < 50 ? 'left' : undefined))}
      />
      <span data-testid="active">{active ? `${active.key}@${active.x},${active.y}` : 'none'}</span>
    </div>
  );
};

const getActive = (): string | null => screen.getByTestId('active').textContent;

describe('useElementSize', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('reports the size of the element.', () => {
    mockElementSize(320, 240);
    render(<SizeProbe />);
    expect(screen.getByTestId('size').textContent).toBe('320x240');
  });
});

describe('useChartSelection', () => {
  beforeEach(() => {
    render(<SelectionProbe />);
  });

  afterEach(() => {
    cleanup();
  });

  it('selects the hovered item, at the pointer.', () => {
    hover(screen.getByTestId('a'), 10, 20);
    expect(getActive()).toBe('a@10,20');
  });

  it('clears the selection when the mouse leaves.', () => {
    hover(screen.getByTestId('a'));
    unhover(screen.getByTestId('a'));
    expect(getActive()).toBe('none');
  });

  it('ignores touches moving, which scroll.', () => {
    fireEvent.pointerMove(screen.getByTestId('a'), { pointerType: 'touch' });
    expect(getActive()).toBe('none');
  });

  it('ignores the mouse lifting.', () => {
    fireEvent.pointerUp(screen.getByTestId('a'), { pointerType: 'mouse' });
    expect(getActive()).toBe('none');
  });

  it('ignores touches leaving.', () => {
    tap(screen.getByTestId('a'));
    fireEvent.pointerLeave(screen.getByTestId('a'), { pointerType: 'touch' });
    expect(getActive()).toBe('a@0,0');
  });

  it('selects a tapped item, and clears it when tapped again.', () => {
    tap(screen.getByTestId('a'));
    expect(getActive()).toBe('a@0,0');
    tap(screen.getByTestId('a'));
    expect(getActive()).toBe('none');
  });

  it('moves the selection to another tapped item.', () => {
    tap(screen.getByTestId('a'));
    tap(screen.getByTestId('b'));
    expect(getActive()).toBe('b@0,0');
  });

  it('selects the item an area finds under the pointer.', () => {
    hover(screen.getByTestId('area'), 10, 0);
    expect(getActive()).toBe('left@10,0');
  });

  it('clears the selection when an area finds nothing under the pointer.', () => {
    hover(screen.getByTestId('area'), 10, 0);
    hover(screen.getByTestId('area'), 90, 0);
    expect(getActive()).toBe('none');
  });

  it('clears the selection when a pointer goes down outside the chart.', () => {
    tap(screen.getByTestId('a'));
    fireEvent.pointerDown(document.body);
    expect(getActive()).toBe('none');
  });

  it('keeps the selection when a pointer goes down inside the chart.', () => {
    tap(screen.getByTestId('a'));
    fireEvent.pointerDown(screen.getByTestId('b'));
    expect(getActive()).toBe('a@0,0');
  });

  it('clears the selection when anything scrolls.', () => {
    tap(screen.getByTestId('a'));
    act(() => {
      document.dispatchEvent(new Event('scroll'));
    });
    expect(getActive()).toBe('none');
  });
});
