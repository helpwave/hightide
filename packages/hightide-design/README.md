# @helpwave/hightide-design

TypeScript design tokens extracted from `@helpwave/hightide` CSS theme files.

## Usage

```ts
import {
  basicColors,
  semanticColors,
  componentColors,
  elementSizes,
  inputElementSizes,
  buttonPadding,
  type ThemeMode,
} from '@helpwave/hightide-design'

const mode: ThemeMode = 'dark'

const background = semanticColors[mode].background
const inputHeight = inputElementSizes.md.height
const buttonPaddingY = buttonPadding.md.paddingY
```

## Token modules

| File | Exports |
| --- | --- |
| `color-basic.ts` | Flattened palette (`basicColors`) for light and dark |
| `color-semantic.ts` | Semantic colors (`semanticColors`) with resolved hex per mode |
| `color-component.ts` | Component colors (`componentColors`) with resolved hex per mode |
| `size.ts` | Spacing, element sizes, input sizes, breakpoints, animation durations |
| `padding.ts` | Element and button padding tokens |

All color tokens are flattened hex values per theme mode. Semantic and component tokens resolve CSS variable references from hightide into concrete values.

## Source of truth

Tokens mirror:

- `packages/hightide/src/style/theme/colors/basic.css`
- `packages/hightide/src/style/theme/colors/semantic.css`
- `packages/hightide/src/style/theme/colors/component.css`
- `packages/hightide/src/style/theme/variables.css`
- `packages/hightide/src/style/theme/element.css`
- `packages/hightide/src/style/theme/components/button.css`
- `packages/hightide/src/style/theme/components/input-elements.css`

When CSS tokens change, update the corresponding TypeScript files in this package.
