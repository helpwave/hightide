# Typography

This document describes semantic typography roles in hightide and how components should pick styles from them.

## Roles

| Role | Purpose |
| --- | --- |
| **display** | Very large type for hero and marketing emphasis. Single style (not sized). |
| **heading** | Titles and section hierarchy (`sm` / `md` / `lg`). |
| **body** | Normal reading text (`sm` / `md` / `lg`). |
| **label** | Control chrome — buttons, chips, inputs, and similar interactive labels (`sm` / `md` / `lg`). |

Sizes use `TypographySizes` = `sm` | `md` | `lg`, aligned with the three-step component size API.

## Shared scales

- **fontWeights** (`SemanticFontWeightTokens`) — numeric weight ladder: `thin`, `light`, `base`, `medium`, `semibold`, `bold`.
- **fontFamilies** (`SemanticFontFamilies`) — semantic family roles:
  - `default` — default UI body/label family (from theme `default`)
  - `accent` — display and heading emphasis
  - `mono` — code and monospace surfaces

Each `HightideTypographyStyleToken` already bakes in concrete `fontSize`, `lineHeight`, `fontWeight`, and `fontFamily`. Use `fontWeights` / `fontFamilies` when composing overrides or one-off styles outside a role token.

## Component usage

Component tokens should reference a semantic role + size (for example button → `label[size]`) rather than inventing ad-hoc font sizes. Nested content themes inherit those baked text styles so labels and icons stay aligned with the host control.
