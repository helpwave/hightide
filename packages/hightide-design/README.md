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
  type PrimitiveTokens,
  type SizeStep,
} from "@helpwave/hightide-design/primitive";
import {
  toLightThemeTokens,
  toDarkThemeTokens,
  resolveStateBasedProperty,
  type ThemeTokens,
  type ComponentSize,
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
const filledPrimary = light.semantic.colorSchemes.primary.filled;
const buttonHeight = light.components.button.layout.md.size;
const controlMd = light.semantic.elementLayout.control.md;
const translucent = HexColorUtils.hexWithAlpha(background, 0.5);
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-design/primitive` | Structured `PrimitiveTokens` (incl. `sizes` 0…160/4, `border` 0…10) |
| `@helpwave/hightide-design/theme` | `ThemeTokens`, light/dark adapters, layout roles, `StateBasedProperty` |
| `@helpwave/hightide-design/semantic` | Semantic mapper (`elementLayout`, `createColorSchemes`, pruned colors + `colorSchemes`) |
| `@helpwave/hightide-design/components` | Component colors/layouts + `toHightideComponentTokens` |
| `@helpwave/hightide-design/design-system` | `designSystem`, `constructThemeTokens`, coloring helpers |
| `@helpwave/hightide-design/utils` | `HexColorUtils` |

## Pipeline

```text
PrimitiveTokens
      │
      ▼  toLightThemeTokens / toDarkThemeTokens   // @theme — palettes + layout roles
ThemeTokens
      │
      ▼  toSemantic({ themeTokens })               // @semantic — prune colors + build colorSchemes
SemanticTokens
      │
      ▼  toComponents({ semanticTokens })          // @components
ComponentTokens
      │
      ▼  DesignSystemTokens { semantic, components }
```

Color scheme shape (role → style → state):

```ts
semantic.colorSchemes.primary.filled // StateBasedProperty<ColorState>
semantic.colorSchemes.neutral.outline
```

`ThemeColorTokens` is an independent theme-layer type (surface colors + inlined role colors). `semantic.colors` is a pruned surface set; `toSemantic` builds `semantic.colorSchemes` from theme role colors. Platform themes read surfaces from `semantic.colors` and roles from `semantic.colorSchemes`.

Layout layers:

- Primitive `sizes` steps `0…160` (step 4); primitive `border` steps `0…10`
- Theme `size` / `padding` / `paddingExtension` / `border` as `ComponentSize` (`xs…xl`) roles
- Semantic `elementLayout.control|container`, `border` as `thin|base|thick` (from theme `xs`/`md`/`xl`), `icon.size = control.size - 2 * control.inset`

`ColorState` = `{ background, foreground, border }`. Resolve with `resolveStateBasedProperty(property, states)` in order `base → focused → hover → pressed → disabled`.

## Structure

```
src/
  primitive/
  theme/           ThemeTokens, light/dark adapters, StateBasedProperty, layout roles
  semantic/        toSemantic + colorSchemes + typography + elementLayout + icon
  components/      toComponents + component colors/layouts
  design-system/   designSystem assembly + constructThemeTokens
  utils/           HexColorUtils
```
