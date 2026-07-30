import type { ColorToken } from '../primitive-tokens/color'
import type {
  ShadowLayoutToken,
  ShadowSizeKey
} from '../primitive-tokens/shadow'
import { hightideShadow } from '../primitive-tokens/shadow'

export type ShadowToken = ShadowLayoutToken & {
  color: ColorToken,
}

export type HightideThemeShadowTokens = {
  sizes: Record<ShadowSizeKey, ShadowLayoutToken>,
  colors: Record<'light' | 'base' | 'dark', ColorToken>,
}

export const hightideLightThemeShadowTokens: HightideThemeShadowTokens = {
  sizes: hightideShadow.layout.bottom,
  colors: {
    light: hightideShadow.colors['2%'],
    base: hightideShadow.colors['5%'],
    dark: hightideShadow.colors['10%'],
  },
}

export const hightideDarkThemeShadowTokens: HightideThemeShadowTokens = {
  sizes: {
    xs: { x: 0, y: 2, blur: 12, spread: 0 },
    sm: { x: 0, y: 3, blur: 18, spread: 0 },
    md: { x: 0, y: 4, blur: 28, spread: 0 },
    lg: { x: 0, y: 6, blur: 40, spread: 0 },
    xl: { x: 0, y: 8, blur: 56, spread: 0 },
  },
  colors: {
    light: hightideShadow.colors['5%'],
    base: hightideShadow.colors['10%'],
    dark: '#00000040',
  },
}
