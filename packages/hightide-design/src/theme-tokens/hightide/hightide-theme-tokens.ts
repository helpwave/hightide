import { hightidePrimitiveTokens } from '../../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../../primitive-tokens/hightide/color-palettes'
import { createDarkThemeTokens } from './create-dark-theme-tokens'
import { createLightThemeTokens } from './create-light-theme-tokens'
import { colorPair } from '../create/wrap'

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

const {
  purple,
  white,
} = palettes

const whiteColor = white.value

export const hightideLightThemeTokens = createLightThemeTokens({
  color: {
    primary: colorPair(purple[500].value, whiteColor),
    secondary: colorPair('#00735e', whiteColor),
    tertiary: colorPair('#924800', whiteColor),
  },
})

export const hightideDarkThemeTokens = createDarkThemeTokens({
  color: {
    primary: colorPair(purple[400].value, whiteColor),
    secondary: colorPair('#009078', whiteColor),
    tertiary: colorPair('#af6a36', whiteColor),
  },
})
