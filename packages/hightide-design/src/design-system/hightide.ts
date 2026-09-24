import type { HightideResolverConfig } from '../primitive-tokens/resolver-types'
import type { ThemeTokens } from '../theme-tokens/create'
import type { SemanticTokens } from '../semantic-tokens/semantic-tokens'
import type { ComponentTokens } from '../component-tokens/component-tokens'
import type { HightideThemeTokens } from '../theme-tokens/hightide'
import type { HightidePrimitiveTokens } from '../primitive-tokens/hightide'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import {
  hightideDarkThemeTokens,
  hightideLightThemeTokens
} from '../theme-tokens/hightide'
import {
  semanticTokens,
  type HightideSemanticTokens
} from '../semantic-tokens/hightide'
import { componentTokens } from '../component-tokens/hightide'

export type DesignSystem<
  Theme extends ThemeTokens,
  Config extends HightideResolverConfig
> = {
  themes: Record<string, Theme>,
  semantics: SemanticTokens<Config>,
  components: ComponentTokens<Config>,
}

export type HightideDesignSystem = {
  primitives: HightidePrimitiveTokens,
  themes: {
    light: HightideThemeTokens,
    dark: HightideThemeTokens,
  },
  semantics: HightideSemanticTokens,
  components: typeof componentTokens,
}

export const hightideDesignSystem = {
  primitives: hightidePrimitiveTokens,
  themes: {
    light: hightideLightThemeTokens,
    dark: hightideDarkThemeTokens,
  },
  semantics: semanticTokens,
  components: componentTokens,
} as const satisfies HightideDesignSystem
