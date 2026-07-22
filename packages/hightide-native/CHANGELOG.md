# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-07-21

### Added

- Native-owned `DesignTheme` types (`Color`, `ColorPalette`, `TextStyle`) that no longer import theme shapes from `@helpwave/hightide-design`
- Forced hightide shapes on `DesignTheme`: `HightideColors`, `HightideSemanticColors`, `HightideTypography`, `HightideLayout`, `HightideDecoration`, and `HightideComponentThemes`
- `layout` and `decoration` fields on `DesignTheme`
- Theme adapter unwraps design palette tokens (`singleValue` / `basic` / `detailed`) into flat `Color` / `ColorPalette` values

### Changed

- `DesignTheme` is no longer generic; `useTheme` returns a fixed `DesignTheme`
- `ComponentThemes` is now a loose `Record<string, unknown>`; required resolvers live on `HightideComponentThemes`
- Coloring definitions moved under `theme.components.coloring` (no longer top-level `theme.coloring`)
- Top-level `palettes` renamed to `colors`
- `createDesignTheme` consumes `HightideDesignTokens` and maps `semanticColors` / `componentColors` / `decorcation`
- Imports switched to `@helpwave/hightide-design/types` and `@helpwave/hightide-design/tokens` subpaths

## [0.0.2] - 2026-07-21

### Added

- Chat components with web API parity (`ChatAttachmentCard`, `ChatConversationList`, `ChatConversationRow`, `ChatDateDivider`, `ChatMessageBubble`, `ChatMessageCard`, `ChatMessageComposer`, `ChatMessageList`, `ChatQuickReplyChip`, `ChatSystemLine`, `ChatThreadHeader`)
- Settings-style `Menu` family (`Menu`, `MenuItem`, `MenuActionItem`, `MenuNavigationItem`)
- Theme resolvers and types for chat and menu components
- `leading` prop on all menu item types; `trailing` on `MenuItem` and `MenuActionItem`

### Changed

- Replaced `ResolverFunction` with `StyleResolverFunction`, which accepts an optional style overwrite (`TStyle` or `(prev, state) => TStyle`)
- Component theme style types now use React Native `StyleProp<ViewStyle>` / `StyleProp<TextStyle>`
- Style override props use `StyleOverwrite` and are applied via the resolver (`theme.components.*.*(state, styleOverride)`)
- Menu item rows use a minimum height of 64 and vertically centered content
- Renamed menu `icon` prop to `leading` on `MenuActionItem` and `MenuNavigationItem`

## [0.0.1] - 2026-07-20

### Added

- Initial public release of `@helpwave/hightide-native`
- React Native UI components (`Button`, `Checkbox`, `Chip`, `IconButton`, `Input`, `MultiSelect`, `Select`)
- `HightideProvider` and related global contexts for theme, localization, and translation
- Theme factories and style resolvers aligned with hightide design tokens
- Shared hooks (`useSelect`, `useMultiSelect`, `useNativeKeyValueStore`) and icon components
