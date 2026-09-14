import { hightidePrimitiveTokens } from '../../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../../primitive-tokens/hightide/color-palettes'
import { TokenBuilder } from '../../utils'
import type { ThemeTokensModeConfig } from '../create/theme-tokens-config'
import type { HightideThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultLightElevationTokens,
  defaultTintConfig,
  resolveSharedGroups,
  tertiaryLightColor
} from './defaults'
import { colorPair } from '../create/wrap'

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

const {
  gray,
  green,
  orange,
  red,
  blue,
  white,
  black,
} = palettes

export const createLightThemeTokens = (
  config: ThemeTokensModeConfig
): HightideThemeTokens => {
  const tintConfig = config.color.tintConfig ?? defaultTintConfig
  const whiteColor = white.value
  const blackColor = black.value

  const primary = config.color.primary
  const secondary = config.color.secondary ?? colorPair(blue[500].value, whiteColor)
  const tertiary = config.color.tertiary ?? colorPair(tertiaryLightColor, whiteColor)
  const positive = config.color.positive ?? colorPair(green[500].value, whiteColor)
  const warning = config.color.warning ?? colorPair(orange[500].value, whiteColor)
  const negative = config.color.negative ?? colorPair(red[600].value, whiteColor)
  const neutral = colorPair(gray[150].value, blackColor)
  const background = config.color.background ?? colorPair(gray[75].value, gray[900].value)
  const surface = config.color.surface ?? colorPair(gray[25].value, gray[900].value)
  const surfaceVariant = config.color.surfaceVariant ?? colorPair(whiteColor, gray[900].value)
  const disabled = config.color.disabled ?? colorPair(gray[300].value, gray[500].value)
  const overlay = config.color.overlay ?? TokenBuilder.color('#00000039')

  return {
    color: buildColorTokens({
      tintConfig,
      background,
      surface,
      surfaceVariant,
      disabled,
      primary,
      secondary,
      tertiary,
      positive,
      warning,
      negative,
      neutral,
      overlay,
    }),
    ...resolveSharedGroups(config, defaultLightElevationTokens(), {
      tonal: {
        color: TokenBuilder.number(0.95),
        onColor: TokenBuilder.number(0.2),
      },
      transparent: {
        color: TokenBuilder.number(0.3),
        onColor: TokenBuilder.number(1),
      },
    }),
  }
}
