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
  type HightidePrimitiveTokens,
  type SizeStep,
} from "@helpwave/hightide-design/primitive-tokens";
import {
  hightideLightThemeTokens,
  hightideDarkThemeTokens,
  hightideSharedThemeTokens,
  resolveStateBasedProperty,
  type HightideThemeTokens,
} from "@helpwave/hightide-design/theme-tokens";
import {
  hightideLightSemanticTokens,
  toHightideSemanticTokens,
} from "@helpwave/hightide-design/semantic-tokens";
import {
  hightideLightComponentTokens,
  toHightideComponentTokens,
  type ComponentSize,
} from "@helpwave/hightide-design/component-tokens";
import {
  hightideDesignSystem,
  coloringTypes,
  type HightideDesignSystemTokens,
} from "@helpwave/hightide-design/design-system";
import { HexColorUtils } from "@helpwave/hightide-design/utils";

const light = hightideDesignSystem.themes.light;
const background = light.semantic.colors.background;
const filledPrimary = light.semantic.colorSchemes.primary.filled;
const buttonHeight = light.components.button.layout.md.size;
const controlMd = light.semantic.elementLayout.control.md;
const translucent = HexColorUtils.hexWithAlpha(background, 0.5);
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-design/primitive-tokens` | Structured `HightidePrimitiveTokens` (incl. `sizes` 0…160/4, `border` 0…10) |
| `@helpwave/hightide-design/theme-tokens` | `HightideThemeTokens`, shared/light/dark constants, layout roles, `StateBasedProperty` |
| `@helpwave/hightide-design/semantic-tokens` | Semantic mapper + precomputed light/dark semantic tokens + `colorSchemes` |
| `@helpwave/hightide-design/component-tokens` | Component mapper + precomputed light/dark component tokens |
| `@helpwave/hightide-design/design-system` | `hightideDesignSystem`, coloring helpers |
| `@helpwave/hightide-design/utils` | `HexColorUtils` |

## Pipeline

```text
HightidePrimitiveTokens
      │
      ▼  hightideSharedThemeTokens + light/dark color maps   // @theme
HightideThemeTokens   // hightideLightThemeTokens / hightideDarkThemeTokens
      │
      ▼  toHightideSemanticTokens({ themeTokens })           // @semantic
HightideSemanticTokens   // hightideLightSemanticTokens / hightideDarkSemanticTokens
      │
      ▼  toHightideComponentTokens({ semanticTokens })       // @components
HightideComponentTokens   // hightideLightComponentTokens / hightideDarkComponentTokens
      │
      ▼  HightideDesignSystemTokens { theme, semantic, components }
```

Color scheme shape (role → style → state):

```ts
semantic.colorSchemes.primary.filled // StateBasedProperty<ColorState>
semantic.colorSchemes.neutral.outline
```

`HightideThemeColorTokens` is an independent theme-layer type (surface colors + inlined role colors). `semantic.colors` is a pruned surface set; `toSemantic` builds `semantic.colorSchemes` from theme role colors. Platform themes read surfaces from `semantic.colors` and roles from `semantic.colorSchemes`.

Layout layers:

- Primitive `sizes` steps `0…160` (step 4); primitive `border` steps `0…10`
- Theme `size` / `padding` / `paddingExtension` / `borderRadius` as `ThemeLayoutSizes` (`xs…xl`) roles; component APIs use `ComponentSize` (`sm…lg`) from `/component-tokens`
- Semantic `elementLayout.control|container|insideControl` include `borderWidth` and `borderRadius`; `insideControl.size = control.size - 2 * control.inset - 2 * control.borderWidth`

`ColorState` = `{ background, foreground, border }`. Resolve with `resolveStateBasedProperty(property, states)` in order `base → focused → hover → pressed → disabled`.

## Structure

```
src/
  primitive-tokens/
  theme-tokens/      HightideThemeTokens, shared/light/dark constants, StateBasedProperty, layout roles
  semantic-tokens/   toSemantic + precomputed semantic constants + colorSchemes + typography
  component-tokens/  toComponents + precomputed component constants
  design-system/   hightideDesignSystem assembly
  utils/           HexColorUtils
```
