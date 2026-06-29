/**
 * @helpwave/hightide-tokens
 *
 * The platform-agnostic design tokens for the helpwave "hightide" design
 * language. This package is the single source of truth that both
 * `@helpwave/hightide` (web) and `@helpwave/hightide-native` (React Native)
 * build on, so the two libraries can never visually drift apart.
 *
 * It ships:
 *  - the raw color palette and semantic (light/dark) colors,
 *  - typography, spacing, radii, elevation and motion scales,
 *  - the role/treatment "coloring" model used by buttons, chips, …,
 *  - a Tailwind/NativeWind `hightidePreset` and a `createGlobalCss()` helper,
 *  - ready-to-use `lightTheme` / `darkTheme` objects.
 */
export * from './palette'
export * from './semantic'
export * from './typography'
export * from './spacing'
export * from './radii'
export * from './elevation'
export * from './motion'
export * from './coloring'
export * from './css-variables'
export * from './tailwind-preset'
export * from './theme'
