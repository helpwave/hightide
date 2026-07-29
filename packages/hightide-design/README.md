# @helpwave/hightide-design

TypeScript design tokens extracted from `@helpwave/hightide` CSS theme files. Intended for React Native and other non-CSS consumers that need the same palettes, semantic colors, and layout values as the web library.

## Install

```bash
pnpm add @helpwave/hightide-design
```

## Usage

There is **no package root export**. Import from folder entry points:

```ts
import {
  hightidePrimitiveTokens,
  type ElementSize,
  type PrimitiveTokens,
} from "@helpwave/hightide-design/primitive";
import {
  toLightThemeTokens,
  toDarkThemeTokens,
  resolveStateBasedProperty,
  type ThemeTokens,
} from "@helpwave/hightide-design/theme";
import { toHightideSemanticTokens } from "@helpwave/hightide-design/semantic";
import { toHightideComponentTokens } from "@helpwave/hightide-design/components";
import {
  designSystem,
  coloringTypes,
  constructThemeTokens,
  type DesignSystemTokens,
} from "@helpwave/hightide-design/design-system";
import { HexColorUtils } from "@helpwave/hightide-design/utils";

const light = designSystem.themes.light;
const background = light.semantic.colors.background;
const filledPrimary = light.semantic.coloring.filled.primary;
const buttonHeight = light.components.layout.button.md.size;
const translucent = HexColorUtils.hexWithAlpha(background, 0.5);
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-design/primitive` | Structured `PrimitiveTokens` |
| `@helpwave/hightide-design/theme` | `ThemeTokens`, light/dark theme adapters, `StateBasedProperty`, coloring packs |
| `@helpwave/hightide-design/semantic` | Semantic mapper (passthrough coloring + composed typography) |
| `@helpwave/hightide-design/components` | Component colors/layouts + `toHightideComponentTokens` |
| `@helpwave/hightide-design/design-system` | `designSystem`, `constructThemeTokens`, coloring helpers |
| `@helpwave/hightide-design/utils` | `HexColorUtils` |

## Pipeline

```text
PrimitiveTokens
      │
      ▼  toLightThemeTokens / toDarkThemeTokens   // @theme — palettes + coloring packs
ThemeTokens
      │
      ▼  toSemantic({ themeTokens })               // @semantic
SemanticTokens
      │
      ▼  toComponents({ semanticTokens })          // @components
ComponentTokens
      │
      ▼  DesignSystemTokens { semantic, components }
```

Coloring shape (style → role → state):

```ts
semantic.coloring.filled.primary // StateBasedProperty<ColorState>
semantic.coloring.outline.neutral
```

`ColorState` = `{ background, foreground, border }`. Resolve with `resolveStateBasedProperty(property, states)` in order `base → focused → hover → pressed → disabled`.

## Structure

```
src/
  primitive/
  theme/           ThemeTokens, light/dark adapters, StateBasedProperty, coloring
  semantic/        toSemantic + typography
  components/      toComponents + component colors/layouts
  design-system/   designSystem assembly + constructThemeTokens
  utils/           HexColorUtils
```
