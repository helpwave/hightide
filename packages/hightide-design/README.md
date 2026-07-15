# @helpwave/hightide-design

TypeScript design tokens extracted from `@helpwave/hightide` CSS theme files.

## Structure

```
src/
  types/          Token type definitions
  tokens/         Fully static token values
  helpers/        Runtime helpers and style resolvers
```

### Token types

- `ColorPaletteBasic`, `ColorPaletteDetailed` — palette steps using `#hex`, `rgb()`, or `rgba()` values
- `ScalingUnit` — unitless layout numbers (reference pixels at 16px root)
- `FixedUnit` — unitless fixed values (stroke widths, font sizes, etc.)
- `SemanticColors` — fixed semantic color set per theme
- `ComponentColors` — component colors grouped by component (e.g. `menu.background`, `input.text`)
- `ComponentLayouts` — per-component sizes, padding, radii, and shared spacing

### Static tokens

- `tokens/palettes.ts` — color palettes shared across themes
- `tokens/themes/light.ts`, `tokens/themes/dark.ts` — complete themes with palettes, semantic, and component colors
- `tokens/layouts/component-layouts.ts` — component layout definitions

### Helpers

- `helpers/theme.ts` — `getTheme`, `getSemanticColors`, `getComponentColors`
- `helpers/units.ts` — `remToPx`, `getIconSizePx`, `toPx`
- `helpers/style-resolvers/` — button and chip style resolution for React Native

## Usage

```ts
import {
  themes,
  colorPalettes,
  componentLayouts,
  getTheme,
  getSemanticColors,
  resolveButtonStyles,
  type ThemeMode,
  type ScalingUnit,
} from '@helpwave/hightide-design'

const mode: ThemeMode = 'dark'
const theme = getTheme(mode)
const background = theme.semantic.background
const menuBackground = theme.component.menu.background
const buttonHeight = componentLayouts.element.md.height
```

Legacy rem-based exports (`spacing`, `buttonPadding`, `elementSizes`, etc.) remain available for existing consumers.

## Source of truth

Tokens mirror:

- `packages/hightide/src/style/theme/colors/basic.css`
- `packages/hightide/src/style/theme/colors/semantic.css`
- `packages/hightide/src/style/theme/colors/component.css`
- `packages/hightide/src/style/theme/variables.css`
- `packages/hightide/src/style/theme/element.css`
- `packages/hightide/src/style/theme/components/button.css`
- `packages/hightide/src/style/theme/components/chip.css`
- `packages/hightide/src/style/theme/components/input-elements.css`
