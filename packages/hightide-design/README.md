# @helpwave/hightide-design

TypeScript design tokens extracted from `@helpwave/hightide` CSS theme files. Intended for React Native and other non-CSS consumers that need the same palettes, semantic colors, and layout values as the web library.

## Install

```bash
pnpm add @helpwave/hightide-design
```

## Usage

There is **no package root export**. Import from folder entry points:

```ts
import { Themes, colorPalettes, componentLayouts, typography } from "@helpwave/hightide-design/tokens";
import { hexWithAlpha } from "@helpwave/hightide-design/helpers";
import type { DesignTokens, ElementSize } from "@helpwave/hightide-design/types";

const theme = Themes.dark;
const background = theme.semanticColors.background;
const buttonHeight = componentLayouts.element.md.height;
const headline = typography.headline.large;
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-design/tokens` | Static token values (palettes, themes, layout, typography) |
| `@helpwave/hightide-design/types` | Token type definitions |
| `@helpwave/hightide-design/helpers` | Runtime helpers and style resolvers |

## Structure

```
src/
  types/          Token type definitions
  tokens/         Fully static token values
  helpers/        Runtime helpers and style resolvers
```

### Token types

- `ColorPaletteBasic`, `ColorPaletteDetailed` — palette steps using `#hex` values
- `ScalingUnitToken` — unitless layout numbers (reference pixels at 16px root)
- `FixedUnitToken` — unitless fixed values (stroke widths, font sizes, etc.)
- `SemanticColorTokens` — fixed semantic color set per theme
- `ComponentColorTokens` — component colors grouped by component (e.g. `menu.background`, `input.text`)
- `ComponentLayoutTokens` — per-component sizes, padding, radii, and shared spacing
- `TypographyTokens` / `TypographyStyleToken` — semantic typography styles

### Static tokens

- `tokens/color-palettes.ts` — color palettes shared across themes
- `tokens/themes/light.ts`, `tokens/themes/dark.ts` — complete themes
- `tokens/layout.ts` — component layout definitions
- `tokens/typography/` — font weights, sizes, line heights, and the composed `typography` scale

### Helpers

- `helpers/color.ts` — `hexWithAlpha`
- `helpers/style-resolvers/` — coloring token helpers for React Native

## Source of truth

Tokens mirror:

- `packages/hightide/src/style/theme/colors/basic.css`
- `packages/hightide/src/style/theme/colors/semantic.css`
- `packages/hightide/src/style/theme/colors/component.css`
- `packages/hightide/src/style/theme/variables.css`
- `packages/hightide/src/style/theme/element.css`
- `packages/hightide/src/style/theme/typography.css`
- `packages/hightide/src/style/theme/components/button.css`
- `packages/hightide/src/style/theme/components/chip.css`
- `packages/hightide/src/style/theme/components/input-elements.css`
