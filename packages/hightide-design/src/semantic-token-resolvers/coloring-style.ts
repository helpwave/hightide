import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { OKLCHUtils } from '../utils/oklch'
import type { ColoringStyle, ColoringTokens } from './types'

export const resolveColoringStyle = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  style: ColoringStyle,
}): ColoringTokens => {
  const { color, onColor } = params.colorPair

  switch (params.style) {
  case 'filled':
    return {
      background: color,
      text: onColor,
      accent: color,
    }
  case 'outline':
    return {
      background: 'transparent',
      text: color,
      accent: color,
    }
  case 'tonal':
    return {
      background: OKLCHUtils.changeLightness(color, 0.95),
      text: OKLCHUtils.changeLightness(color, 0.2),
      accent: color,
    }
  case 'tonal-outline':
    return {
      background: OKLCHUtils.changeLightness(color, 0.95),
      text: OKLCHUtils.changeLightness(color, 0.2),
      accent: color,
    }
  case 'text':
    return {
      background: 'transparent',
      text: color,
      accent: color,
    }
  }
}
