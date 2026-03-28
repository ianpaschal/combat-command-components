import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { buildThemeVars } from '../src/components/ThemeProvider/ThemeProvider.utils';
import { light } from '../src/components/ThemeProvider/themes/light';

const generated = Object.entries(buildThemeVars(light)).map(([key, value]) => (
  `  ${key}: ${value};`
)).join('\n');

const filePath = join(dirname(fileURLToPath(import.meta.url)), '../src/style/variables.scss');
const content = readFileSync(filePath, 'utf-8');

const START_MARKER = '  // @generated-start';
const END_MARKER = '  // @generated-end';

const startIdx = content.indexOf(START_MARKER);
const endIdx = content.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find @generated-start / @generated-end markers in variables.scss');
}

writeFileSync(filePath, [
  content.slice(0, startIdx + START_MARKER.length),
  generated,
  content.slice(endIdx),
].join('\n\n'), 'utf-8');
