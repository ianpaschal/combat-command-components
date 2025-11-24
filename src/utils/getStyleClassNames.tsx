import {
  ElementIntent,
  ElementSize,
  ElementVariant,
} from '../types';

import borders from '../style/borders.module.scss';
import corners from '../style/corners.module.scss';
import sizes from '../style/sizes.module.scss';
import variants from '../style/variants.module.scss';

const camelKey = (keys: string[]) => keys.map((key, i) => (
  i === 0 ? key : key.charAt(0).toUpperCase() + key.slice(1)
)).join('');

type GetStyleClassNamesConfig = {
  intent?: ElementIntent;
  variant?: ElementVariant;
  size?: ElementSize;
  collapsePadding?: boolean;
  rounded?: boolean;
  square?: boolean;
  border?: boolean | 'top' | 'bottom' | 'left' | 'right';
  corners?: boolean | 'tight' | 'normal' | 'wide';
};

export const getStyleClassNames = (config: GetStyleClassNamesConfig): string[] => {
  const classNames: Set<string> = new Set();

  if (config.intent && !config.variant) {
    classNames.add(variants.passive);
    classNames.add(variants[config.intent]);
  }

  if (config.variant) {
    classNames.add(variants[config.variant]);
    classNames.add(variants[config.intent ?? 'neutral']);
  }

  if (config.border) {
    if (typeof config.border === 'string') {
      const key = camelKey(['border', config.border]) as keyof typeof borders;
      classNames.add(borders[key]);
    } else {
      classNames.add(borders.border);
    }
    classNames.add(variants[config.intent ?? 'neutral']);
  }

  if (config.corners) {
    if (typeof config.corners === 'string') {
      const key = camelKey(['corners', config.corners]) as keyof typeof corners;
      classNames.add(corners[key]);
    } else {
      classNames.add(corners.corners);
    }
  }

  if (config.size) {
    const key = camelKey(['size', config.size]) as keyof typeof sizes;
    classNames.add(sizes[key]);

    if (config.rounded) {
      classNames.add(sizes.rounded);
    }

    if (config.square) {
      classNames.add(sizes.square);
    }

    if (config.collapsePadding) {
      classNames.add(sizes.collapsePadding);
    }
  }

  return Array.from(classNames);
};
