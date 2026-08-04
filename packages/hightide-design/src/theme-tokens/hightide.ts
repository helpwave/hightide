import type { ColorToken } from '../primitive-tokens/color'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import { createDarkThemeTokens } from './create-dark-theme-tokens'
import { createLightThemeTokens } from './create-light-theme-tokens'
import { tertiaryDarkColor, tertiaryLightColor } from './defaults'

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

const {
  purple,
  blue,
  white,
} = palettes

const whiteColor = white.value as ColorToken

export const hightideLightThemeTokens = createLightThemeTokens({
  colors: {
    primary: {
      color: purple.value[500],
      onColor: whiteColor,
    },
    secondary: {
      color: blue.value[500],
      onColor: whiteColor,
    },
    tertiary: {
      color: tertiaryLightColor,
      onColor: whiteColor,
    },
  },
})

export const hightideDarkThemeTokens = createDarkThemeTokens({
  colors: {
    primary: {
      color: purple.value[400],
      onColor: whiteColor,
    },
    secondary: {
      color: blue.value[500],
      onColor: whiteColor,
    },
    tertiary: {
      color: tertiaryDarkColor,
      onColor: whiteColor,
    },
  },
})
