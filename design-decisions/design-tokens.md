# Design tokens

This document describes how hightide structures design tokens, how they are assembled into `ThemeTokens`, and how platform packages map those tokens into a runtime `Theme` that apps consume through a `ThemeContext`.

## Goals

- Keep raw palettes (primitives) separate from meaning (semantics) and component-specific color choices.
- Build complete, platform-agnostic `ThemeTokens` once in `@helpwave/hightide-design`.
- Let each UI package (`hightide-native` today, `hightide` later) translate `ThemeTokens` into a platform `Theme` with resolvers suited to React Native styles or web CSS/class patterns.
- Deliver that `Theme` through a context so apps can switch modes and overwrite or extend themes without forking components.

## Token layers

Token construction is a pipeline with four conceptual layers. Each layer only depends on the ones above it.

```text
PrimitiveTokens
      │
      ▼  toSemantic(themeName, primitiveTokens)
SemanticTokens
      │
      ▼  toComponents(themeName, primitiveTokens, semanticTokens)
ComponentTokens
      │
      ▼  toTheme(themeName, primitiveTokens, semanticTokens, componentTokens)
ThemeTokens
```

In code this pipeline is `constructThemeTokens` in `@helpwave/hightide-design/utils`. Default hightide mappers live under `packages/hightide-design/src/tokens/mappings/`.

### 1. PrimitiveTokens

Raw, mode-agnostic building blocks. They have no product meaning by themselves.

Examples:

- Color palettes (`gray`, `purple`, `blue`, …) as typed `{ type, value }` wrappers
- Shared layout numbers, typography scales, decoration, and animation tokens that are not theme-mode specific

Hightide’s default primitives are `colorPalettes` plus the static layout/typography/decoration/animation modules in `@helpwave/hightide-design/tokens`.

### 2. SemanticTokens

Named roles derived from primitives for a given theme mode (`light`, `dark`, or a custom name).

Examples:

- `background` / `onBackground`
- `primary` / `onPrimary` / `primaryHover`
- `surface`, `disabled`, `warning`, …

Mapper: `toHightideSemanticTokens` (`tokens/mappings/to-semantic.ts`).

Semantics are the layer you usually override when branding (for example “use blue as primary”).

### 3. ComponentTokens

Colors (and related values) scoped to specific components, built from primitives and semantics for a theme mode.

Examples:

- `input.background`, `menu.background`
- Chat / carousel / other component-specific slots

Mapper: `toHightideComponentTokens` (`tokens/mappings/to-components.ts`).

Prefer changing semantics first; use component tokens when a control needs a deliberate exception.

### 4. ThemeTokens

The assembled, platform-agnostic design package for one theme mode. Hightide’s shape is `HightideThemeTokens`:

- `colors` — primitives
- `semanticColors` — semantics
- `componentColors` — component tokens
- `coloring` — solid/outline/tonal style definitions derived from semantics
- `typography`, `layout`, `animation`, `decorcation`

Mapper: `toHightideTheme` (`tokens/mappings/to-theme.ts`), which also attaches shared layout/typography/animation/decoration and builds `coloring`.

`ThemeTokens` are still data. They are not yet React Native `StyleSheet` values or web CSS variables applied to components.

## From ThemeTokens to Theme

Each UI package owns a second mapping step: **ThemeTokens → Theme**.

```text
ThemeTokens  ──createHightideTheme──►  Theme  ──ThemeProvider──►  components
```

### hightide-native (current)

`createHightideTheme` in `@helpwave/hightide-native`:

1. Unwraps palette tokens into flat `Color` / `ColorPalette` values.
2. Exposes `semantic`, `typography`, `layout`, and `decoration` for direct use.
3. Builds `components.*` style resolvers (button, chip, chat, avatar, …) from the design tokens.

The result is a `HightideTheme` (a strict form of the loose `Theme` type) that native components read via `useTheme()`.

### hightide (planned)

The web package should follow the same contract:

1. Consume the same `ThemeTokens` from `@helpwave/hightide-design`.
2. Map them into a web `Theme` (CSS variables, class recipes, or resolver functions—whichever matches the web stack).
3. Provide that theme through the same context pattern so mode switching and overrides stay consistent across platforms.

Design tokens stay shared; only the **ThemeTokens → Theme** adapter is platform-specific.

## ThemeContext: switching and overwriting

Mapped themes are not global singletons. They are registered and selected through a `ThemeProvider` / `ThemeContext` setup.

### Why

- Switch between `light`, `dark`, system preference, or custom modes at runtime.
- Register additional themes (branded or Storybook demos) without changing component code.
- Overwrite or extend an existing theme (for example primary color) by supplying a new `Theme` instance in `supportedThemes`.

### How (native today)

1. Build one or more `Theme` objects with `createHightideTheme(themeTokens)` (optionally after customizing mappers / `constructThemeTokens`).
2. Pass them into `ThemeProvider` as `supportedThemes` (defaults come from `HightideConfigUtils.defaultSupportedThemes`).
3. Components call `useTheme()` to read the active `theme`, `themeMode`, and related config.
4. Apps change mode through the context API; listeners such as `onChangedTheme` can persist the choice.

Overwrite pattern:

- Clone or rebuild `ThemeTokens` with alternate semantic/component mappers.
- Run `createHightideTheme`.
- Register the result under a mode key (or replace `light` / `dark`) in `supportedThemes`.

Extension pattern:

- Keep the base `HightideTheme`.
- Add extra `components.*` resolvers on a widened theme type and register that object the same way.

## Practical recipe

```text
1. Start from PrimitiveTokens (colorPalettes, …)
2. Optionally customize toSemantic / toComponents / toTheme
3. constructThemeTokens(...) → ThemeTokens
4. createHightideTheme(themeTokens) → Theme   // native; web equivalent later
5. Provide Theme via ThemeProvider / ThemeContext
6. Components consume useTheme()
```

## Package ownership

| Concern | Package |
| --- | --- |
| Primitive / semantic / component / theme token types and default mappers | `@helpwave/hightide-design` |
| `constructThemeTokens`, `hexWithAlpha`, coloring helpers | `@helpwave/hightide-design/utils` |
| ThemeTokens → native Theme + style resolvers | `@helpwave/hightide-native` |
| ThemeTokens → web Theme (future) | `@helpwave/hightide` |
| Theme mode storage / shared theme context utilities | `@helpwave/hightide-utils` + platform ThemeProvider |

## Design rules

- Do not skip layers: components should not hard-code palette steps when a semantic or component token exists.
- Keep `ThemeTokens` free of React / React Native types so design can stay dependency-light.
- Put platform styling in the Theme adapter and component resolvers, not in the design package.
- Prefer extending or replacing themes through context registration over branching inside components.
