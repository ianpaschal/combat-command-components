### How It Works

`ThemeProvider` manages the active theme along two independent axes: `key` (which registered theme family, e.g. `"classic"` or `"storm"`) and `mode` (`"light"`, `"dark"`, or `"__system"`).
It generates CSS custom properties into a `<style>` block in `<head>` and switches themes via two attributes on `<html>`: `data-theme-key` and `data-theme-mode`.

At registration time, each variant's CSS variables are pre-computed and cached.
`getThemeStyleSheet()` serializes every registered family into a single CSS block, each variant scoped by `:root[data-theme-key="<key>"][data-theme-mode="<light|dark>"]`.
Switching themes is two `setAttribute` calls rather than N `setProperty` calls.

The active `key` and `mode` are persisted to `localStorage` under `THEME_STORAGE_KEY` (`"cc-theme"`) and `THEME_MODE_STORAGE_KEY` (`"cc-theme-mode"`) respectively.
A blocking preflight script (`injectThemePreflight()`) can be dropped into `<head>` to apply the saved theme before first paint.
This avoids a flash of unstyled content on first paint.

### Basic Usage

Wrap your app in `ThemeProvider`.
No other setup is needed for React apps.
The stylesheet is injected automatically on mount.

```tsx
import { ThemeProvider } from '@ianpaschal/combat-command-components';

export const App = () => (
  <ThemeProvider>
    <YourApp />
  </ThemeProvider>
);
```

To lock a specific key and/or mode (e.g. in a preview or demo), pass the `themeKey`/`themeMode` props:

```tsx
<ThemeProvider themeKey="storm" themeMode="dark">
  <YourApp />
</ThemeProvider>
```

### Built-In Themes

| Key | Display Name |
|---|---|
| `classic` | Classic |
| `storm` | Storm |

Each key has a `light` and a `dark` variant.
`SYSTEM_THEME_KEY` (`"__system"`), passed as `mode`, resolves to `light` or `dark` based on `prefers-color-scheme`.
It is the default when no preference is stored.

### Accessing the Theme in a Component

```tsx
import { useThemeManager } from '@ianpaschal/combat-command-components';

const { key, mode, theme, options, setTheme } = useThemeManager();
```

| Property | Type | Description |
|---|---|---|
| `key` | `string` | The active key. |
| `mode` | `ThemeMode` | The active mode, including `"__system"` if no explicit choice was made. |
| `theme` | `Theme` | The resolved `Theme` object for the current `key`/`mode`. |
| `options` | `SelectOption[]` | All registered keys, ready for a `<Select>`. |
| `setTheme` | `(key: string, mode: ThemeMode) => void` | Updates the active key/mode and persists it to localStorage. |

### Registering a Custom Theme

Call `registerTheme` before the app mounts.
It registers a whole family (both variants plus a display name) in one call, each variant deep-merged onto the corresponding variant of a parent family (defaults to `"classic"`).

```ts
import { registerTheme } from '@ianpaschal/combat-command-components';

registerTheme('branded', {
  displayName: 'Branded',
  light: {
    surface: {
      page: { bg: '#f0e8ff' },
      card: { bg: '#ffffff', border: '#d8c8f0' },
    },
    colors: {
      accent: { bg: '#7c3aed', text: '#ffffff', focus: '#7c3aed' },
    },
  },
  dark: {
    colors: {
      accent: { bg: '#a78bfa', text: '#1e1033', focus: '#a78bfa' },
    },
  },
});
```

Custom themes registered before `getThemeStyleSheet()` is first called are included in the generated stylesheet.

### SSR / Static Sites (e.g. Astro)

For server-rendered pages, inject the stylesheet and preflight script into `<head>` before any content renders:

```astro
---
import {
  getThemeStyleSheet,
  injectThemePreflight,
} from '@ianpaschal/combat-command-components';

const themeCSS = getThemeStyleSheet();
---
<head>
  <!-- Inject CSS vars for all themes, scoped to :root[data-theme-key][data-theme-mode]. -->
  <style is:inline set:html={themeCSS}></style>
  <!-- Blocking script: reads localStorage and sets data-theme-key/data-theme-mode before first paint. -->
  <script is:inline set:html={injectThemePreflight()}></script>
</head>
```

The `<style>` tag carries a `data-theme-vars` attribute so the client-side `ThemeProvider` won't inject a duplicate.

### API Reference

#### `ThemeProvider`

| Prop | Type | Default | Description |
|---|---|---|---|
| `themeKey` | `string` | - | Locks the active key; overrides user selection and localStorage. |
| `themeMode` | `ThemeMode` | - | Locks the active mode; overrides user selection and localStorage. |
| `children` | `ReactNode` | - | |

#### `getThemeStyleSheet(): string`

Serializes all registered themes' CSS variables into a single CSS string, each variant scoped by `:root[data-theme-key="<key>"][data-theme-mode="<light|dark>"]`.
In a browser context, also injects the result as a `<style data-theme-vars>` element in `<head>` (idempotent).
Returns the CSS string.

#### `injectThemePreflight(defaults?): string`

Returns a self-executing script string that reads the two `localStorage` slots and sets `data-theme-key`/`data-theme-mode` on `<html>` before first paint.
If nothing is stored yet, or only a legacy single-slot value from before the `key`/`mode` split exists, it decodes that into a key/mode pair and falls back to `prefers-color-scheme` for `"__system"`.

`defaults` is an optional object overriding the family key used when nothing is stored at all:

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | `"storm"` | The family key applied when nothing is stored yet. |

```ts
// Use the built-in default ("storm")
injectThemePreflight()

// Default to a different registered family
injectThemePreflight({ key: 'classic' })
```

Drop the returned string into a blocking `<script>` in `<head>`.

#### `registerTheme(key, theme, parentKey?)`

Registers a theme family (its `light` and `dark` variants, plus a `displayName`) or overrides an existing one.
Each variant is deep-merged onto the corresponding variant of `parentKey` (Default: `"classic"`).
CSS variables are computed and cached immediately.

#### `THEME_STORAGE_KEY`

The localStorage key used to persist the active `key` (`"cc-theme"`).
Use this if you need to read or write the preference outside of `ThemeProvider`.

#### `THEME_MODE_STORAGE_KEY`

The localStorage key used to persist the active `mode` (`"cc-theme-mode"`).
Use this if you need to read or write the preference outside of `ThemeProvider`.

#### `SYSTEM_THEME_KEY`

The sentinel value (`"__system"`) that resolves to `"light"` or `"dark"` based on `prefers-color-scheme`.
Passed as `mode` to `setTheme` to restore automatic OS-based switching.
