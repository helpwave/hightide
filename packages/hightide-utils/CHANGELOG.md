# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2026-07-23

### Changed

- Same-package imports must use relative paths; directory barrel imports were rewritten to concrete modules
- Removed `@/*` TypeScript path mapping and Jest `@/` mapper
- ESLint bans `@/` imports via `no-restricted-imports`

## [0.0.3] - 2026-07-22

### Added

- `SupportedLocalesConfig` (`Record<string, LocaleInformation>`) for locale metadata keyed by locale id

### Changed

- `LocaleInformation` is now `{ localName: string }`; locale id is the key in `SupportedLocalesConfig`
- `useCreateLocalizationContext` / `LocalizationContextValue.supportedLocales` use `SupportedLocalesConfig` instead of a `LocaleInformation[]` array

## [0.0.2] - 2026-07-22

### Added

- `useUnstableMapperWarning` hook to warn when a mapper identity changes within 1s (`hookName` required, optional `disabled`)
- Subpath export `@helpwave/hightide-utils/hooks/useUnstableMapperWarning`
- Generic theme config types: `ThemeMode`, `ThemeInformation<T>`, `SupportedThemesConfig<T>`, `ThemeConfigValue<T>`

### Changed

- `useCreateThemeConfig` now takes a `SupportedThemesConfig<T>` record (keyed by theme mode) instead of a `ThemeInformation[]` array
- Context fields renamed: `preferredTheme` → `preferredThemeMode`, resolved mode exposed as `themeMode`, and `theme` is the resolved payload `T` from `supportedThemes[themeMode].theme`
- Localization context typing aligned with the updated theme/locale utilities

## [0.0.1] - 2026-07-20

### Added

- Initial public release of `@helpwave/hightide-utils`
- Utility modules under `@helpwave/hightide-utils/utils` (`ArrayUtil`, `DateUtils`, and related helpers)
- Shared React hooks under `@helpwave/hightide-utils/hooks`
- Localization, translation, and theme context entry points
- Typed i18n helpers and translations under `@helpwave/hightide-utils/i18n`
- `barrel` CLI for generating folder `index.ts` barrels
