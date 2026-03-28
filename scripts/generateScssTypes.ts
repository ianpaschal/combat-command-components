import { readdirSync, writeFileSync } from 'fs';
import { dirname,join } from 'path';
import { compile } from 'sass';
import { fileURLToPath } from 'url';

function findModuleScss(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findModuleScss(full));
    } else if (entry.name.endsWith('.module.scss')) {
      results.push(full);
    }
  }
  return results;
}

function toCamelCase(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function extractClassNames(css: string): string[] {
  const stripped = css.replace(/"[^"]*"|'[^']*'/g, '""');
  const names = new Set<string>();
  const regex = /\.([a-zA-Z][a-zA-Z0-9-_]*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(stripped)) !== null) {
    names.add(toCamelCase(match[1]));
  }
  return [...names].sort();
}

const files = findModuleScss(join(dirname(fileURLToPath(import.meta.url)), '../src'));

for (const file of files) {
  const result = compile(file);
  const classNames = extractClassNames(result.css);
  const content = classNames.map((name) => `export declare const ${name}: string;`).join('\n') + '\n';
  writeFileSync(file + '.d.ts', content, 'utf-8');
}
