<img width="2160" height="450" alt="backdrop" src="https://github.com/user-attachments/assets/a610b433-7a66-4d5b-9cf0-00e5cd324f0c" />

# Combat Command: Game Systems

A React component library for the Combat Command application.

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

> **NOTE:** Although the _code_ in this repository is licensed under the MIT License, "Combat Command" and associated logos are trademarks of Combat Command and may not be used without permission.
> The <AppLogo/> component exists as a means to render the Combat Command logo according to brand guidelines _when/where permitted_.
