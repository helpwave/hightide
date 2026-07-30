# Design tokens

This document describes how hightide structures design tokens, how they are assembled into a `HightideDesignSystem`, and how platform packages map `HightideDesignSystemTokens` into a runtime `Theme` that apps consume through a `ThemeContext`.

## Goals

- Keep raw palettes (primitives) separate from mode-resolved foundations (theme), meaning (semantics), and component-specific choices.
- Build complete, platform-agnostic `HightideDesignSystemTokens` once in `@helpwave/hightide-design`.
- Let each UI package (`hightide-native` today, `hightide` later) translate those tokens into a platform `Theme` with resolvers suited to React Native styles or web CSS/class patterns.
- Deliver that `Theme` through a context so apps can switch modes and overwrite or extend themes without forking components.

## Token layers

```text
HightidePrimitiveTokens   // sizes 0…160/4, border 0…10
      │
      ▼  hightideSharedThemeTokens + light/dark color maps
HightideThemeTokens   // hightideLightThemeTokens / hightideDarkThemeTokens
      │
      ▼  toHightideSemanticTokens({ themeTokens })
HightideSemanticTokens   // hightideLightSemanticTokens / hightideDarkSemanticTokens
      │
      ▼  toHightideComponentTokens({ semanticTokens })
HightideComponentTokens   // hightideLightComponentTokens / hightideDarkComponentTokens
      │
      ▼  HightideDesignSystemTokens { theme, semantic, components }
```

Hightide ships precomputed constants per mode. Custom themes can still call `toHightideSemanticTokens` / `toHightideComponentTokens` after overriding a `HightideThemeTokens` object.

Public export:

```ts
hightideDesignSystem = {
  primitives: HightidePrimitiveTokens,
  themes: {
    light: HightideDesignSystemTokens,
    dark: HightideDesignSystemTokens,
  },
}
```

### 1. HightidePrimitiveTokens

Raw, mode-agnostic building blocks under `@helpwave/hightide-design/primitive`.

Includes `sizes` (`0…160`, step 4) and `border` (`0…10`). There is no primitive `elements` map.

### 2. HightideThemeTokens

Precomputed as `hightideLightThemeTokens` / `hightideDarkThemeTokens` (`@helpwave/hightide-design/theme`):

- Shared non-color fields live in `hightideSharedThemeTokens` (`Omit<HightideThemeTokens, 'color'>`)
- `color` — `HightideThemeColorTokens` (surface colors + inlined role colors for scheme build inputs); only layer that differs by light/dark
- `size` / `padding` / `paddingExtension` / `border` — each `Record<ComponentSize, number>` (`xs…xl`); theme `border` is size roles only (not `thin|base|thick`)
- `typography.fontFamily` — remapped roles `default` / `accent` / `mono` from primitive font registry
- Other non-color scales passthrough from primitives

`ColorState` = `{ background, foreground, border }`. Resolve with `resolveStateBasedProperty` in order `base → focused → hover → pressed → disabled`.

### 3. HightideSemanticTokens

Precomputed as `hightideLightSemanticTokens` / `hightideDarkSemanticTokens` via `toHightideSemanticTokens`:

- pruned `colors` (`HightideSemanticColorTokens`) from theme (no role scheme inputs)
- `colorSchemes` — built via `createHightideColorSchemes(themeTokens.color)` (`filled`, `outline`, `tonal`, `tonal-outline`, `text`)
- `elementLayout: { control, container }` from theme size/padding/paddingExtension/border
- `border: HightideSemanticBorderTokens` (`thin ← xs`, `base ← md`, `thick ← xl`)
- `icon: HightideIconThemeTokens` where `size = control.size - 2 * control.inset`
- compose typography; passthrough spacing/radius/shadow

### 4. HightideComponentTokens

Precomputed as `hightideLightComponentTokens` / `hightideDarkComponentTokens` via `toHightideComponentTokens` — colors + layouts from semantic only.

- button / iconButton / chip: full `ComponentSize` from `elementLayout.control` (chip adjusted)
- input: single layout from `control.md`
- checkbox: `ComponentSizeBasic` mapped one step down (`sm→xs`, `md→sm`, `lg→md`)
- icon: `semantic.icon` sizes + `semantic.border.base` stroke

### 5. HightideDesignSystemTokens

```ts
{ theme: HightideThemeTokens, semantic: HightideSemanticTokens, components: HightideComponentTokens }
```

## From HightideDesignSystemTokens to Theme

```text
HightideDesignSystemTokens  ──createHightideTheme──►  Theme  ──ThemeProvider──►  components
```

Native `createHightideTheme` maps `tokens.semantic.colors` → `theme.colors` and flattens semantic layout/schemes onto the runtime theme. `resolveColoringStyles` maps `InteractionState` → `Set<ElementState>` and calls `resolveStateBasedProperty` on `theme.colorSchemes[role][style]`.

## Package ownership

| Concern | Package entry |
| --- | --- |
| Primitives | `/primitive` |
| HightideThemeTokens, shared/light/dark constants, StateBasedProperty | `/theme` |
| Semantic mapper + precomputed semantic constants + `createHightideColorSchemes` | `/semantic` |
| Component tokens + precomputed component constants | `/components` |
| `hightideDesignSystem` assembly | `/design-system` |
| `HexColorUtils` | `/utils` |
| HightideDesignSystemTokens → native Theme | `@helpwave/hightide-native` |

## Design rules

- Do not skip layers: `toSemantic` / `toComponents` must never read color palettes.
- All light/dark branching lives in the theme color maps behind `hightideLightThemeTokens` / `hightideDarkThemeTokens`.
- Color schemes are declarative at theme build time (including baked tonal alphas).
- Prefer extending themes through context registration over branching inside components.
