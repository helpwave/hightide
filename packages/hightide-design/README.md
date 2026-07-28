# @helpwave/hightide-design

TypeScript design tokens extracted from `@helpwave/hightide` CSS theme files. Intended for React Native and other non-CSS consumers that need the same palettes, semantic colors, and layout values as the web library.

## Install

```bash
pnpm add @helpwave/hightide-design
```

## Usage

There is **no package root export**. Import from folder entry points:

```ts
import { colorPalettes, componentLayouts, type ElementSize } from "@helpwave/hightide-design/primitive";
import { toHightideSemanticTokens, typography } from "@helpwave/hightide-design/semantic";
import {
  ThemeTokens,
  coloringTypes,
  constructThemeTokens,
  hexWithAlpha,
  type HightideThemeTokens,
} from "@helpwave/hightide-design/theme";

const theme = ThemeTokens.dark;
const background = theme.semanticColors.background;
const buttonHeight = componentLayouts.element.md.height;
const headline = typography.scales.headline.large;
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-design/primitive` | Raw palettes, layout, decoration, animation, and typography scales |
| `@helpwave/hightide-design/semantic` | Semantic color mapper and composed typography styles |
| `@helpwave/hightide-design/theme` | Component tokens, theme assembly, themes, and color utilities |

## Structure

```
src/
  primitive/      Mode-agnostic token values and type definitions
  semantic/       Named semantic roles, mapper, and typography composition
  theme/          Component tokens, theme construction, themes, and utilities
```

### Primitive

- `color.ts` / `color-palettes.ts` — palette types and shared color palettes
- `layout.ts` — component layout definitions and `ElementSize`
- `decoration.ts` / `animation.ts` — border radii and motion durations
- `typography/` — font sizes, weights, and line heights

### Semantic

- `to-semantic.ts` — `toHightideSemanticTokens`
- `typography.ts` — composed typography scale (`headline.large`, `body.medium`, …)
- `hightide.ts` / `color.ts` — semantic color type definitions

### Theme

- `to-components.ts` / `to-theme.ts` — component and theme mappers
- `themes/` — `lightTheme`, `darkTheme`, and `ThemeTokens`
- `constructThemeTokens.ts` — theme token construction pipeline
- `color.ts` / `coloring-utils.ts` — `hexWithAlpha`, `coloringTypes`, `getColoringToken`
- `hightide.ts` / `component-colors.ts` / `coloring.ts` / `design.ts` — theme type definitions

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
