import {
  describe,
  expect,
  it,
} from 'vitest';

import { getAnnouncement, getTooltipStyle } from './Chart.utils';

describe('getAnnouncement', () => {
  it('reads out the title, then each row\'s label and value.', () => {
    expect(getAnnouncement({
      title: 'Germany',
      rows: [
        { color: 'blue', label: 'Attacker', value: '60%' },
        { color: 'orange', label: 'Defender', value: '40%' },
      ],
    })).toBe('Germany, Attacker 60%, Defender 40%');
  });
});

describe('getTooltipStyle', () => {
  it('places the tooltip below and right of the pointer in the top left of the viewport.', () => {
    expect(getTooltipStyle(100, 50, 800, 600)).toEqual({
      left: 100,
      top: 50,
      transform: 'translate(12px, 12px)',
    });
  });

  it('places the tooltip above and left of the pointer in the bottom right of the viewport.', () => {
    expect(getTooltipStyle(700, 500, 800, 600)).toEqual({
      left: 700,
      top: 500,
      transform: 'translate(calc(-100% - 12px), calc(-100% - 12px))',
    });
  });
});
