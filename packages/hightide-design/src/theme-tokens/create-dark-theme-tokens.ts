import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import type { ColorPairToken, ThemeTokensModeConfig } from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultDarkElevationTokens,
  defaultTintConfig,
  resolveSharedGroups,
  tertiaryDarkColor
} from './defaults'

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
): ThemeTokens => {
  const tintConfig = config.colors.tintConfig ?? defaultTintConfig
  const whiteColor = white.value

  const primary = config.colors.primary
  const secondary: ColorPairToken = config.colors.secondary ?? {
    color: blue.value[500],
    onColor: whiteColor,
  }
  const tertiary: ColorPairToken = config.colors.tertiary ?? {
    color: tertiaryDarkColor,
    onColor: whiteColor,
  }
  const positive: ColorPairToken = config.colors.positive ?? {
    color: green.value[700],
    onColor: whiteColor,
  }
  const warning: ColorPairToken = config.colors.warning ?? {
    color: orange.value[500],
    onColor: whiteColor,
  }
  const negative: ColorPairToken = config.colors.negative ?? {
    color: red.value[600],
    onColor: whiteColor,
  }
  const neutral: ColorPairToken = {
    color: gray.value[750],
    onColor: whiteColor,
  }
  const background: ColorPairToken = config.colors.background ?? {
    color: gray.value[850],
    onColor: gray.value[100],
  }
  const surface: ColorPairToken = config.colors.surface ?? {
    color: gray.value[800],
    onColor: gray.value[100],
  }
  const surfaceVariant: ColorPairToken = config.colors.surfaceVariant ?? {
    color: gray.value[900],
    onColor: gray.value[100],
  }
  const disabled: ColorPairToken = config.colors.disabled ?? {
    color: gray.value[500],
    onColor: gray.value[300],
  }

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
    }),
    ...resolveSharedGroups(config, defaultDarkElevationTokens()),
    coloring: {
      tonal: {
        color: config.coloring?.tonal?.color ?? 0.3,
        onColor: config.coloring?.tonal?.onColor ?? 0.95,
      },
      transparent: {
        color: config.coloring?.tonal?.color ?? 0.4,
        onColor: config.coloring?.tonal?.onColor ?? 1,
      }
    }
  }
}
