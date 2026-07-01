/**
 * @helpwave/hightide-native
 *
 * helpwave's "hightide" design language for React Native – the basic building
 * blocks for mobile apps. It shares its design tokens with the web library
 * (`@helpwave/hightide`) through `@helpwave/hightide-tokens`, so the two stay
 * visually in sync.
 *
 * Desktop-web-only patterns (AppPage, Carousel, Table, data-grid filtering, …)
 * are intentionally excluded – see ../../docs/native/COMPONENT-INVENTORY.md.
 */

// Theme ---------------------------------------------------------------------
export * from './theme/ThemeContext'

// Primitives ----------------------------------------------------------------
export * from './primitives/Text'

// Components ----------------------------------------------------------------
export * from './components/Button'
export * from './components/IconButton'
export * from './components/Card'
export * from './components/Chip'
export * from './components/Badge'
export * from './components/Avatar'
export * from './components/Switch'
export * from './components/Checkbox'
export * from './components/Spinner'
export * from './components/Divider'

// Styling utilities ---------------------------------------------------------
export * from './styling/coloring'
export * from './styling/element'
export * from './styling/color'
export * from './styling/slot'
export { cn } from './styling/cn'

// Hooks ---------------------------------------------------------------------
export * from './hooks/useControlledState'

// Re-export the design tokens so consumers have one entry point.
export * from '@helpwave/hightide-tokens'
