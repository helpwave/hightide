# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-08-19

### Added

- Runtime theme fields mirroring flattened design tokens: `size`, `padding`, `borderWidth`, `elevation`, `motion`, `focusOutline`, `fontSizing`, `fontWeights`, `fontFamilies`, and `config`
- Overlay `stateLayer` resolvers on `Select` and `MultiSelect` (same pattern as `Button`)
- `ChatThreadHeader` pressable wrapping avatar and title/subtitle (`onPress`, `disabled`, `pressableContainerStyle`)
- `ChatConversationRow` pressable theming via `ThemedPressable`
- Unified `StyleAdapterUtils` (`container`, `text`, `icon`, `containerWithStateLayer`, and granular layout/border helpers)

### Changed

- Consumes `@helpwave/hightide-design@0.3.0` flattened `ThemeTokens`
- `theme.typography` is only role styles; use `theme.fontWeights` / `theme.fontFamilies` / `theme.fontSizing`
- `theme.border` renamed to `theme.borderWidth`
- Container / text / icon resolvers go through `StyleAdapterUtils`; borders resolve to physical `top` / `right` / `bottom` / `left`
- List item minimum height uses `layout.size + spacing.md`

### Removed

- Separate `container-adapter`, `text-style-adapter`, `icon-style-adapter`, and `defined` adapter modules
- `theme.border` (use `theme.borderWidth`)
- `theme.typography.fontWeights` and `theme.typography.fontFamilies`

## [0.2.0] - 2026-08-17

### Added

- `ContentThemeRootProvider` and `ContentThemeOverrideProvider` with `foreground`, `textStyle`, and `iconStyle` (override values support updaters)
- `ListItemTextContent` and `ListItemAccessory` for shared list title/subtitle rendering and accessory content theming
- Icon theme resolvers for `ThemedPressable` and `Chip` (including chat pressable wrappers that consume pressable tokens)
- Minimum touch-target `hitSlop` and debug hit-box overlay for `ListActionItem` and `ListNavigationItem`

### Changed

- List item APIs use `title` / `subtitle` / `content` / `contentOrder` instead of `label` / `value`
- Content theme context exposes a single `foreground` color instead of a color pair
- `ThemedText`, `ThemedIcon`, buttons, chips, pressables, and list accessories consume the updated content theme
- Consumes `@helpwave/hightide-design@0.2.0` pressable / chip icon tokens, list icon sizing, and foreground-default list icon color

### Removed

- Icon button text theme resolver (icons are themed via content theme `iconStyle` only)

## [0.1.1] - 2026-08-17

### Changed

- Consumes `@helpwave/hightide-design@0.1.1` numeric `FontWeightToken` values through the text style adapter

## [0.1.0] - 2026-08-17

### Added

- `ThemedPressable`, `ThemedText`, `ThemedIcon`, `Card`, `Divider`, `SearchBar`, and list item components (`ListItem`, `ListActionItem`, `ListNavigationItem`)
- Content theme and debug context wiring (hit-box visualization via `@helpwave/hightide-utils/context/debug`)
- Minimum touch-target `hitSlop` helpers and debug hit-box overlay for pressable controls
- Theme adapters split into container, text style, and icon style adapters
- Semantic theme types and resolvers aligned with the new design-token pipeline (including chat, list, card, pressable, and search bar)

### Changed

- Theme creation and component resolvers now consume the layered `@helpwave/hightide-design` token / resolver APIs
- Renamed menu surfaces to card / list item APIs (`Menu*` → `Card` / `List*`)
- Chat attachment and message card surfaces reworked around `ChatAttachmentMessageBubble` and message bubble tokens
- Avatar theming split across `Avatar`, `AvatarWithStatus`, and `AvatarGroup`; checkbox / switch / select / multi-select / chat controls updated for state layers and touch targets
- Storybook moved out of the package into dedicated native / native-web apps

### Removed

- `Menu`, `MenuItem`, `MenuActionItem`, and `MenuNavigationItem`
- `ChatAttachmentCard` and `ChatMessageCard` (replaced by bubble-based chat components)
- Package-local Storybook config and stories (moved to apps)
- `AvatarWithLabel` and the previous `Icon` display component (replaced by `ThemedIcon`)

## [0.0.8] - 2026-07-24

### Added

- Custom `Switch` under user-interaction built from `Pressable` + `View` with animated thumb translate/size, inactive track border, and `accessibilityRole` / `accessibilityState` for checked and disabled
- Switch theme types and `createSwitchTheme` / `createSwitchThemeFromDesign` resolvers on `theme.components.switch` (`trackColor`, `borderColor`, `thumbColor`)
- Storybook demo under `stories/User Interaction/Switch.stories.tsx`

## [0.0.7] - 2026-07-23

### Added

- `Avatar`, `AvatarGroup`, `AvatarWithStatus`, and `AvatarWithLabel` under visualization-and-display
- Avatar theme types and `createAvatarTheme` / `createAvatarThemeFromDesign` resolvers on `theme.components.avatar`
- Storybook demos under `stories/Display And Visualization/Avatar/`

### Changed

- Renamed `createTheme` to `createHightideTheme` and `nativeThemes` to `hightideThemes`
- Split runtime theme typing into a loose `Theme` and a strict `HightideTheme`
- Chat Storybook demos now use `AvatarWithStatus` instead of local placeholders
- Fallback initials / icon hide once the avatar image has loaded

## [0.0.6] - 2026-07-23

### Changed

- Same-package imports now use relative paths instead of the `@/` alias; directory barrel imports were rewritten to concrete modules
- Removed `@/*` TypeScript path mapping and Storybook Vite `@` alias
- ESLint enforces `import/no-internal-modules` (no index barrels) and bans `@/` via `no-restricted-imports`

## [0.0.5] - 2026-07-22

### Added

- Storybook demos under `stories/Internationalization/ExtendTranslations.stories.tsx` for overlaying custom translation keys and registering a new locale (`fr-FR`) via `HightideProvider`

### Changed

- `defaultSupportedLocales` is a `SupportedLocalesConfig` record keyed by locale id with `{ localName }`

## [0.0.4] - 2026-07-22

### Added

- Storybook Theme demos under `stories/Theme/` for component extension, full theme extension via `constructTheme` + `createTheme`, and primary-color overrides
- Shared `ThemeSelect` / `ThemeStoryFrame` helpers for theme stories
- `Icon` under visualization-and-display components
- `createTheme` factory consuming `HightideDesignTokens` from `@helpwave/hightide-design`

### Changed

- Renamed runtime theme type from `DesignTheme` to `Theme`; `useTheme` returns the new shape
- Theme types reorganized under `theme/types/components/*` with `HightideComponentThemes`
- Component resolvers and stories updated for design-token imports and the record-based `supportedThemes` / `preferredThemeMode` theme context API
- `HightideProvider` / `ThemeProvider` align with `SupportedThemesConfig<Theme>` from hightide-utils

### Removed

- `src/icons/Icon.tsx` (replaced by `components/visualization-and-display/Icon.tsx`)

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
