import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import { createDarkThemeTokens } from './create-dark-theme-tokens'
import { createLightThemeTokens } from './create-light-theme-tokens'

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

const {
  purple,
  white,
} = palettes

const whiteColor = white.value

export const hightideLightThemeTokens = createLightThemeTokens({
  color: {
    primary: {
      color: purple.value[500],
      onColor: whiteColor,
    },
    secondary: {
      color: '#00735e',
      onColor: whiteColor,
    },
    tertiary: {
      color: '#924800',
      onColor: whiteColor,
    },
  },
})

export const hightideDarkThemeTokens = createDarkThemeTokens({
  color: {
    primary: {
      color: purple.value[400],
      onColor: whiteColor,
    },
    secondary: {
      color: '#009078',
      onColor: whiteColor,
    },
    tertiary: {
      color: '#af6a36',
      onColor: whiteColor,
    },
  },
})
