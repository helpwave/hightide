import { hightidePrimitiveTokens } from '../../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../../primitive-tokens/hightide/color-palettes'
import type { ThemeTokensModeConfig } from '../create/theme-tokens-config'
import type { HightideThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultDarkElevationTokens,
  defaultTintConfig,
  resolveSharedGroups,
  tertiaryDarkColor
} from './defaults'
import { colorPair, wrapColor, wrapNumber } from '../create/wrap'

const palettes = hightidePrimitiveTokens.color.palettes as HightideColorPalettes

const {
  gray,
  green,
  orange,
  red,
  blue,
  white,
} = palettes

export const createDarkThemeTokens = (
  config: ThemeTokensModeConfig
): HightideThemeTokens => {
  const tintConfig = config.color.tintConfig ?? defaultTintConfig
  const whiteColor = white.value

  const primary = config.color.primary
  const secondary = config.color.secondary ?? colorPair(blue[500].value, whiteColor)
  const tertiary = config.color.tertiary ?? colorPair(tertiaryDarkColor, whiteColor)
  const positive = config.color.positive ?? colorPair(green[700].value, whiteColor)
  const warning = config.color.warning ?? colorPair(orange[500].value, whiteColor)
  const negative = config.color.negative ?? colorPair(red[600].value, whiteColor)
  const neutral = colorPair(gray[750].value, whiteColor)
  const background = config.color.background ?? colorPair(gray[850].value, gray[100].value)
  const surface = config.color.surface ?? colorPair(gray[800].value, gray[100].value)
  const surfaceVariant = config.color.surfaceVariant ?? colorPair(gray[900].value, gray[100].value)
  const disabled = config.color.disabled ?? colorPair(gray[500].value, gray[300].value)
  const overlay = config.color.overlay ?? wrapColor('#00000060')

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
    ...resolveSharedGroups(config, defaultDarkElevationTokens(), {
      tonal: {
        color: wrapNumber(0.3),
        onColor: wrapNumber(0.95),
      },
      transparent: {
        color: wrapNumber(0.4),
        onColor: wrapNumber(1),
      },
    }),
  }
}
