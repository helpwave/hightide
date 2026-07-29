# Design tokens

This document describes how hightide structures design tokens, how they are assembled into a `DesignSystem`, and how platform packages map `DesignSystemTokens` into a runtime `Theme` that apps consume through a `ThemeContext`.

## Goals

- Keep raw palettes (primitives) separate from mode-resolved foundations (theme), meaning (semantics), and component-specific choices.
- Build complete, platform-agnostic `DesignSystemTokens` once in `@helpwave/hightide-design`.
- Let each UI package (`hightide-native` today, `hightide` later) translate those tokens into a platform `Theme` with resolvers suited to React Native styles or web CSS/class patterns.
- Deliver that `Theme` through a context so apps can switch modes and overwrite or extend themes without forking components.

## Token layers

```text
PrimitiveTokens   // sizes 0…160/4, border 0…10
      │
      ▼  toLightThemeTokens / toDarkThemeTokens   // only layer that reads palettes
ThemeTokens   // color + colorSchemes + size/padding/paddingExtension/border (xs…xl)
      │
      ▼  toSemantic({ themeTokens })
SemanticTokens   // elementLayout, SemanticBorderTokens, icon, pruned colors + schemes
      │
      ▼  toComponents({ semanticTokens })
ComponentTokens
      │
      ▼  DesignSystemTokens { semantic, components }
```

`constructThemeTokens` (in `@helpwave/hightide-design/design-system`) takes `toThemeTokens` — no `themeName`. Light/dark themes pass `toLightThemeTokens` / `toDarkThemeTokens` directly.

Public export:

```ts
designSystem = {
  primitives: PrimitiveTokens,
  themes: {
    light: DesignSystemTokens,
    dark: DesignSystemTokens,
  },
}
```

### 1. PrimitiveTokens

Raw, mode-agnostic building blocks under `@helpwave/hightide-design/primitive`.

Includes `sizes` (`0…160`, step 4) and `border` (`0…10`). There is no primitive `elements` map.

### 2. ThemeTokens

Produced by `toLightThemeTokens` / `toDarkThemeTokens` (`@helpwave/hightide-design/theme`):

- `color` — `SemanticColorTokens` + `ThemeRoleColorTokens` (role inputs for schemes)
- `colorSchemes` — role → style → `StateBasedProperty<ColorState>` packs (`filled`, `outline`, `tonal`, `tonal-outline`, `text`)
- `size` / `padding` / `paddingExtension` / `border` — each `Record<ComponentSize, number>` (`xs…xl`); theme `border` is size roles only (not `thin|base|thick`)
- `typography.fontFamily` — remapped roles `default` / `accent` / `mono` from primitive font registry
- Other non-color scales passthrough from primitives

`ColorState` = `{ background, foreground, border }`. Resolve with `resolveStateBasedProperty` in order `base → focused → hover → pressed → disabled`.

### 3. SemanticTokens

From `toHightideSemanticTokens`:

- pruned `colors` from theme (no role scheme inputs); passthrough `colorSchemes`
- `elementLayout: { control, container }` from theme size/padding/paddingExtension/border
- `border: SemanticBorderTokens` (`thin ← xs`, `base ← md`, `thick ← xl`)
- `icon: IconThemeTokens` where `size = control.size - 2 * control.inset`
- compose typography; passthrough spacing/radius/shadow/motion

### 4. ComponentTokens

From `toHightideComponentTokens` (`@helpwave/hightide-design/components`) — colors + layouts from semantic only.

- button / iconButton / chip: full `ComponentSize` from `elementLayout.control` (chip adjusted)
- input: single layout from `control.md`
- checkbox: `ComponentSizeBasic` mapped one step down (`sm→xs`, `md→sm`, `lg→md`)
- icon: `semantic.icon` sizes + `semantic.border.base` stroke

### 5. DesignSystemTokens

```ts
{ semantic: SemanticTokens, components: ComponentTokens }
```

## From DesignSystemTokens to Theme

```text
DesignSystemTokens  ──createHightideTheme──►  Theme  ──ThemeProvider──►  components
```

Native `resolveColoringStyles` maps `InteractionState` → `Set<ElementState>` and calls `resolveStateBasedProperty` on `theme.colorSchemes[role][style]`.

## Package ownership

| Concern | Package entry |
| --- | --- |
| Primitives | `/primitive` |
| ThemeTokens, light/dark adapters, StateBasedProperty, color schemes | `/theme` |
| Semantic mapper + typography | `/semantic` |
| Component tokens + `toComponents` | `/components` |
| `designSystem`, `constructThemeTokens`, helpers | `/design-system` |
| `HexColorUtils` | `/utils` |
| DesignSystemTokens → native Theme | `@helpwave/hightide-native` |

## Design rules

- Do not skip layers: `toSemantic` / `toComponents` must never read color palettes.
- All light/dark branching lives in `toLightThemeTokens` / `toDarkThemeTokens`.
- Color schemes are declarative at theme build time (including baked tonal alphas).
- Prefer extending themes through context registration over branching inside components.
