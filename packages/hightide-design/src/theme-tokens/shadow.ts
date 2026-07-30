import type { ColorToken } from '../primitive-tokens/color'
import type {
  ShadowLayoutToken,
  HightideShadowPrimitiveTokens,
  ShadowSizeKey
} from '../primitive-tokens/shadow'

export type ShadowToken = ShadowLayoutToken & {
  color: ColorToken,
}

export type HightideThemeShadowTokens = {
  sizes: Record<ShadowSizeKey, ShadowLayoutToken>,
  colors: Record<'light' | 'base' | 'dark', ColorToken>,
}

export const toHightideThemeShadow = (
  shadow: HightideShadowPrimitiveTokens
): HightideThemeShadowTokens => ({
  sizes: shadow.layout.bottom,
  colors: {
    light: shadow.colors['2%'],
    base: shadow.colors['5%'],
    dark: shadow.colors['10%'],
  },
})
