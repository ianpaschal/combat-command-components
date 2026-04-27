<img width="2160" height="450" alt="backdrop" src="https://github.com/user-attachments/assets/a610b433-7a66-4d5b-9cf0-00e5cd324f0c" />

# Combat Command: Game Systems

A React component library for the Combat Command application.

## [Storybook](https://ianpaschal.github.io/combat-command-components/)

## Installation

```bash
npm install @ianpaschal/combat-command-components
```

## Peer Dependencies

This library requires the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `react-router-dom` ^7.9.4

## Usage

### Importing Components

```typescript
import { AppLogo, AppNavigation, Badge } from '@ianpaschal/combat-command-components';
import '@ianpaschal/combat-command-components/index.css';
```

### Importing Styles

The library provides several style exports:

```typescript
// Main stylesheet (includes all component styles)
import '@ianpaschal/combat-command-components/index.css';

// CSS variables only
import '@ianpaschal/combat-command-components/styles/variables.css';

// CSS reset only
import '@ianpaschal/combat-command-components/styles/reset.css';
```

## Components

[WIP: See Storybook]

## ThemeProvider

`ThemeProvider` manages the active theme and exposes it (along with controls) to the component tree via context.

### Setup

Wrap your app once at the root. No props are required — the provider always starts on the `__system` theme, which follows the OS light/dark preference.

```tsx
import { ThemeProvider } from '@ianpaschal/combat-command-components';

const App = () => (
  <ThemeProvider>
    <YourApp />
  </ThemeProvider>
);
```

### Registering a theme

Call `registerTheme` at module level before your app mounts. It takes a key, a partial theme object, and an optional parent key to inherit from (defaults to `'light'`).

```ts
import { registerTheme } from '@ianpaschal/combat-command-components';

// Extend the built-in light theme
registerTheme('brand', {
  displayName: 'Brand',
  intents: {
    primary: {
      bg: '#FF5500',
      text: '#FFFFFF',
      focus: '#FF5500',
    },
  },
});

// Extend a different built-in theme
registerTheme('brand-dark', {
  displayName: 'Brand Dark',
  intents: {
    primary: {
      bg: '#FF5500',
      text: '#FFFFFF',
      focus: '#FF5500',
    },
  },
}, 'dark');
```

Built-in keys are `'light'`, `'dark'`, and `'midnight'`. The special key `'__system'` (also exported as `SYSTEM_THEME_KEY`) is the default and resolves to `'light'` or `'dark'` based on `prefers-color-scheme`.

### Switching themes

Use `useThemeManager` inside the tree to read the current state and switch themes:

```tsx
import { useThemeManager } from '@ianpaschal/combat-command-components';

const ThemeSelector = () => {
  const { key, options, setTheme } = useThemeManager();
  return (
    <Select
      value={key}
      options={options}
      onChange={(value) => setTheme(value)}
    />
  );
};
```

`options` is a memoized `SelectOption[]` derived from the registry (including a "System" entry for `__system`), so it always reflects any themes registered at startup.

### Reading the current theme

`useThemeManager` also exposes `theme`, the resolved `Theme` object, for cases where you need direct access to token values:

```ts
const { theme } = useThemeManager();
console.log(theme.surface.card.bg);
```

## Development

### Building

```bash
npm run build
```

### Storybook

View components in Storybook:

```bash
npm run storybook
```

Build Storybook for production:

```bash
npm run build-storybook
```

### Linting

```bash
# TypeScript and ESLint
npm run lint

# SCSS
npm run lint:scss
```

### Generating Type Definitions for SCSS Modules

```bash
npm run gen:scss
```

## License

The code in this repository is licensed under the MIT License.
See `LICENSE` for details.

> **NOTE:** "Combat Command" and the Combat Command logo are trademarks of Ian Paschal and are not licensed under the MIT License. Use of these trademarks requires prior written permission.
> The `<AppLogo/>` component exists as a means to render the Combat Command logo according to brand guidelines _when/where permitted_.
