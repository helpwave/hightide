import type { ColorToken } from '../primitive/color'
import type {
  ShadowLayoutToken,
  ShadowPrimitiveTokens,
  ShadowSizeKey
} from '../primitive/shadow'

export type ShadowToken = ShadowLayoutToken & {
  color: ColorToken,
}

export type ThemeShadowTokens = {
  sizes: Record<ShadowSizeKey, ShadowLayoutToken>,
  colors: Record<'light' | 'base' | 'dark', ColorToken>,
}

export const toHightideThemeShadow = (
  shadow: ShadowPrimitiveTokens
): ThemeShadowTokens => ({
  sizes: shadow.layout.bottom,
  colors: {
    light: shadow.colors['2%'],
    base: shadow.colors['5%'],
    dark: shadow.colors['10%'],
  },
})
