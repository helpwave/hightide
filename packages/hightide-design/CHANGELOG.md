# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-08-21

### Changed

- Conversation row sent indicator uses the description color instead of primary

## [0.3.1] - 2026-08-20

### Added

- `surfaceInverse` color pair on `ThemeTokens.color`, derived as swapped `surface` `color` / `onColor`

## [0.3.0] - 2026-08-20

### Added

- `FontSizingToken` (`fontSize` + `lineHeight`) on primitive typography and as `ThemeTokens.fontSizing`
- Root theme scales `fontWeights` and `fontFamilies` (`default` | `accent` | `mono`)
- Root `borderRadius` and `padding` token maps
- `ThemeTokens.config` with `coloring` and `appearancePercentages`
- Container layout tokens `flexGrow`, `flexShrink`, `flexBasis`, `mainAxisAlignment` (including spacing), `crossAxisAligment` (including stretch), `crossAxisLineAligment`, and `selfCrossAxisAlignment`
- Chat conversation row `pressableOverrides` and thread header `pressableOverwrites`

### Changed

- Flattened `ThemeTokens`: `shape`, `decoration`, and top-level `coloring` moved to the fields above
- `ThemeTypographyTokens` is only role styles (`display`, `heading`, `body`, `label`)
- `ThemeTokensConfig` matches the flattened shape (`fontSizing`, `fontWeights`, `fontFamilies`, `borderRadius`, `padding`, nested `config`)
- Primitive `hightideTypography` uses `fontSizing` instead of separate `fontSize` and `lineHeight` maps
- Semantic and component resolvers read `borderRadius`, `padding`, `fontWeights`, `config.coloring`, and `config.appearancePercentages`
- Input / select / multi-select tokens use theme `color.border`

### Removed

- `ThemeTokens.shape`, `ThemeTokens.decoration`, and top-level `ThemeTokens.coloring`
- `ThemeShapeTokens` and `ThemeDecorationTokens`
- `fontFamilies` / `fontWeights` nested under `typography`
- Container `alignSelf` (replaced by `selfCrossAxisAlignment`)
- Conversation row `container` tokens (replaced by `pressableOverrides`)

## [0.2.0] - 2026-08-17

### Added

- Icon tokens on pressable and chip component resolvers (size via button icon sizing, color from resolved foreground)

### Changed

- List item icon size now resolves from `icongraphy.sizes.md`
- List item icon color defaults to the content foreground (`surface.onColor`, or tonal foreground when a color override is set) instead of primary

### Removed

- Text tokens from the icon button component resolver

## [0.1.1] - 2026-08-17

### Changed

- `FontWeightToken` is now a numeric union (`100 | 200 | … | 900`) instead of string literals (`'100' | …`); default typography weights use numbers

## [0.1.0] - 2026-08-17

### Added

- Layered token pipeline with package exports for `primitive-tokens`, `theme-tokens`, `semantic-token-resolvers`, `component-token-resolvers`, `design-system`, and `utils`
- Semantic token resolvers (coloring, pressable state layers, control / element layout, touch target size, and related helpers)
- Component token resolvers for buttons, chips, inputs, selects, multi-select, checkbox, switch, search bar, avatars, list items, pressable, chat, and related surfaces
- Shared container, text, and icon token shapes used across component resolvers

### Changed

- Restructured the package around primitive → theme → semantic → component token layers (replacing the previous `tokens` / `types` layout)
- Separated theme colors from semantic color schemes; component tokens resolve through semantic resolvers
- Unified component styling around container / text / icon tokens with clearer focus vs focus-visible and state-layer behavior
- Split avatar tokens into `Avatar`, `AvatarWithStatus`, and `AvatarGroup`
- Refined sizing, padding, border, shadow, typography, and chat / list / form control tokens

### Removed

- Breakpoints and motion tokens from the design system
- Previous `@helpwave/hightide-design/types` and `@helpwave/hightide-design/tokens` export surfaces in favor of the new subpaths

## [0.0.6] - 2026-07-24

### Changed

- Replaced `componentColors.switchThumb` with nested `componentColors.switch` (`track` / `thumb`, each with `inactive` / `active`, plus `borderColor` defaulting to the shared border color) so track and border colors are first-class design tokens alongside thumb

## [0.0.5] - 2026-07-23

### Added

- Avatar layout tokens (`avatar` sizes and `avatarGroup` overlap / maxShown / gap) on `componentLayouts`
- `@helpwave/hightide-design/utils` export with `constructThemeTokens`, `hexWithAlpha`, `coloringTypes`, and `ColoringType`

### Changed

- Renamed `HightideDesignTokens` to `HightideThemeTokens`
- Renamed `Themes` to `HightideThemeTokens`
- Renamed `constructTheme` to `constructThemeTokens` and `ThemeConstructorOptions` to `ThemeTokenConstructorOptions`
- Moved `constructThemeTokens` from `hooks/` to `utils/`
- Moved `hexWithAlpha` and coloring helpers (`coloringTypes`, `ColoringType`, `getColoringToken`) into `utils/`
- Inlined `createColoringTokensDefinitions` into `tokens/mappings/to-theme.ts`

### Removed

- `useThemeTokenConstructor` and the `@helpwave/hightide-design/hooks` export
- `@helpwave/hightide-design/helpers` export
- React peer dependency (and related React / `@types/react` devDependencies)

## [0.0.4] - 2026-07-23

### Changed

- Same-package imports now use relative paths instead of the `@/` alias; directory barrel imports (e.g. `../types`) were rewritten to concrete modules
- Removed `@/*` TypeScript path mapping
- ESLint enforces `import/no-internal-modules` (no index barrels) and bans `@/` via `no-restricted-imports`

## [0.0.3] - 2026-07-22

### Added

- Theme construction pipeline: `constructTheme` and `useThemeTokenConstructor` (`@helpwave/hightide-design/hooks`)
- Default Hightide mappers `toHightideSemanticTokens`, `toHightideComponentTokens`, and `toHightideTheme` that switch semantic/component colors by theme mode
- React peer dependency for the theme token constructor hook
- Optional `disabled` flag on `useThemeTokenConstructor` to silence unstable-mapper warnings

### Changed

- Light and dark themes are built through the shared construction pipeline

## [0.0.2] - 2026-07-21

### Added

- `DesignTokens` aggregate type (colors, semantic colors, component colors, coloring, typography, layout, animation, decoration)
- `HightideDesignTokens` with required shapes for every token attribute (`HightideColorPalleteTokens`, `HightideSemanticColorTokens`, `HightideColoringTokens`, `HightideDecorationTokens`, plus existing strict typography/layout/component/animation types)
- Typography tokens (`HightideTypographyTokens`, font sizes/weights/line heights, shared `typography` scale)
- Animation and decoration token modules
- Subpath package exports: `@helpwave/hightide-design/types`, `/tokens`, `/helpers`

### Changed

- Replaced `DesignTheme` with `DesignTokens`; theme fields renamed to `colors`, `semanticColors`, `componentColors`, `coloring`, `typography`, `layout`, `animation`, `decorcation`
- Light/dark themes and color palettes now `satisfies HightideDesignTokens` / `HightideColorPalleteTokens`
- Palette tokens use typed `{ type, value }` wrappers (`singleValue` / `basic` / `detailed`)
- Removed package root export; consumers must import from `/types`, `/tokens`, or `/helpers`

### Removed

- Root `DesignTheme` / `SemanticColors` / `DesignColorPalettes` theme type surface
- Root package entry and theme helper barrel (`getTheme`, `getSemanticColors`, `getComponentColors`)

## [0.0.1] - 2026-07-20

### Added

- Initial public release of `@helpwave/hightide-design`
- TypeScript design tokens mirroring hightide CSS themes (palettes, semantic colors, component colors, layouts)
- Theme helpers (`getTheme`, `getSemanticColors`, `getComponentColors`) and unit helpers (`remToPx`, `toPx`, …)
- Style resolvers for React Native button and chip styling
