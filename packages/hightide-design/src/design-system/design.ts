import type { HightideDesignTokens } from '../design-tokens/designTokens'
import type { HightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideThemeTokens } from '../theme-tokens'

export type HightideDesignSystemTokens = {
  theme: HightideThemeTokens,
} & HightideDesignTokens

export type HightideDesignSystem = {
  primitives: HightidePrimitiveTokens,
  tokenThemes: {
    light: HightideDesignSystemTokens,
    dark: HightideDesignSystemTokens,
  },
}
