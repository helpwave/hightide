# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Typography tokens (`TypographyTokens`, font sizes/weights/line heights, shared `typography` scale)
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
