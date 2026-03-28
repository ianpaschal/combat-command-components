import { readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { compile } from 'sass';
import { fileURLToPath } from 'url';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

function createSpinner(text: string) {
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${SPINNER_FRAMES[i++ % SPINNER_FRAMES.length]} ${text}`);
  }, 80);
  return {
    succeed(msg: string) {
      clearInterval(interval);
      process.stdout.write(`\r${GREEN}✓${RESET} ${msg}\n`);
    },
    fail(msg: string) {
      clearInterval(interval);
      process.stdout.write(`\r${RED}✗ ${msg}${RESET}\n`);
    },
  };
}

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
  const stripped = css

    // Strip CSS block comments:
    .replace(/\/\*[\s\S]*?\*\//g, '')

    // Remove url(...) contents:
    .replace(/url\(\s*[^)]+\)/gi, 'url()')

    // Remove protocol patterns (e.g. http://...):
    .replace(/\b[a-z]+:\/\/[^\s),'";]*/gi, '')

    // Blank out quoted strings:
    .replace(/"[^"]*"|'[^']*'/g, '""');

  const names = new Set<string>();
  const regex = /\.([a-zA-Z][a-zA-Z0-9-_]*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(stripped)) !== null) {
    names.add(toCamelCase(match[1]));
  }
  return [...names].sort();
}

const files = findModuleScss(join(dirname(fileURLToPath(import.meta.url)), '../src'));

console.info(`Found ${files.length} SCSS module file${files.length === 1 ? '' : 's'}`);

for (const file of files) {
  const label = file.split('/src/')[1] ?? file;
  const spinner = createSpinner(label);
  try {
    const result = compile(file);
    const classNames = extractClassNames(result.css);
    const content = classNames.map((name) => `export declare const ${name}: string;`).join('\n') + '\n';
    writeFileSync(file + '.d.ts', content, 'utf-8');
    spinner.succeed(`${label} (${classNames.length} class${classNames.length === 1 ? '' : 'es'})`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    spinner.fail(`${label}: ${message}`);
    throw new Error(`Failed to compile SCSS for ${file}: ${message}`);
  }
}
