### How It Works

`ThemeProvider` manages the active theme by generating CSS custom properties into a `<style>` block in `<head>` and switching themes via a `data-theme` attribute on `<html>`.

At registration time, each theme's CSS variables are pre-computed and cached.
`getThemeStyleSheet()` serializes all registered themes into a single CSS block scoped by `:root[data-theme="<key>"]`.
Switching themes is a single `setAttribute` call rather than N `setProperty` calls.

The active theme key is persisted to `localStorage` under `THEME_STORAGE_KEY` (`"cc-theme"`).
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

To lock a specific theme (e.g. in a preview or demo), pass the `theme` prop:

```tsx
<ThemeProvider theme="dark">
  <YourApp />
</ThemeProvider>
```

### Built-In Themes

| Key | Display Name | Dark |
|---|---|---|
| `light` | Light | No |
| `dark` | Dark | Yes |
| `daybreak` | Daybreak | No |
| `midnight` | Midnight | Yes |

`SYSTEM_THEME_KEY` (`"__system"`) resolves to `dark` or `light` based on `prefers-color-scheme`.
It is the default when no preference is stored.

### Accessing the Theme in a Component

```tsx
import { useThemeManager } from '@ianpaschal/combat-command-components';

const { key, theme, options, setTheme } = useThemeManager();
```

| Property | Type | Description |
|---|---|---|
| `key` | `string` | The active key, including `"__system"` if no explicit choice was made. |
| `theme` | `Theme` | The resolved `Theme` object. |
| `options` | `SelectOption[]` | All registered themes plus the system option, ready for a `<Select>`. |
| `setTheme` | `(key: string) => void` | Updates the active theme and persists it to localStorage. |

### Registering a Custom Theme

Call `registerTheme` before the app mounts.
Each registered theme is merged on top of a parent (defaults to `light`).

```ts
import { registerTheme } from '@ianpaschal/combat-command-components';

registerTheme('branded', {
  displayName: 'Branded',
  dark: false,
  surface: {
    page: { bg: '#f0e8ff' },
    card: { bg: '#ffffff', border: '#d8c8f0' },
  },
  colors: {
    accent: { bg: '#7c3aed', text: '#ffffff', focus: '#7c3aed' },
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
  <!-- Inject CSS vars for all themes, scoped to :root[data-theme]. -->
  <style is:inline set:html={themeCSS}></style>
  <!-- Blocking script: reads localStorage and sets data-theme before first paint. -->
  <script is:inline set:html={injectThemePreflight()}></script>
</head>
```

The `<style>` tag carries a `data-theme-vars` attribute so the client-side `ThemeProvider` won't inject a duplicate.

### API Reference

#### `ThemeProvider`

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | - | Locks the active theme; overrides user selection and localStorage. |
| `children` | `ReactNode` | - | |

#### `getThemeStyleSheet(): string`

Serializes all registered themes' CSS variables into a single CSS string scoped by `:root[data-theme="<key>"]`.
In a browser context, also injects the result as a `<style data-theme-vars>` element in `<head>` (idempotent).
Returns the CSS string.

#### `injectThemePreflight(defaults?): string`

Returns a self-executing script string that reads `localStorage.getItem("cc-theme")` and sets `data-theme` on `<html>` before first paint.
If no key is stored or the stored key is `"__system"`, it falls back to `prefers-color-scheme`, mapping to the resolved theme keys.

`defaults` is an optional object that overrides the theme keys used when the stored value is `"__system"`:

| Property | Type | Default | Description |
|---|---|---|---|
| `dark` | `string` | `"dark"` | The theme key applied when `prefers-color-scheme: dark` matches. |
| `light` | `string` | `"light"` | The theme key applied otherwise. |

When omitted, `"dark"` and `"light"` are used.

```ts
// Use built-in keys (dark → "dark", light → "light")
injectThemePreflight()

// Map system dark/light to custom registered keys
injectThemePreflight({ dark: 'midnight', light: 'daybreak' })
```

Drop the returned string into a blocking `<script>` in `<head>`.

#### `registerTheme(key, theme, parentKey?)`

Registers a new theme or overrides an existing one.
`theme` is deep-merged onto `parentKey` (Default: `"light"`).
CSS variables are computed and cached immediately.

#### `THEME_STORAGE_KEY`

The localStorage key used to persist the active theme choice (`"cc-theme"`).
Use this if you need to read or write the preference outside of `ThemeProvider`.

#### `SYSTEM_THEME_KEY`

The sentinel value (`"__system"`) that resolves to `"light"` or `"dark"` based on `prefers-color-scheme`.
Passed to `setTheme` to restore automatic OS-based switching.
