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
  const tintConfig = config.color.tintConfig ?? defaultTintConfig
  const whiteColor = white.value

  const primary = config.color.primary
  const secondary: ColorPairToken = config.color.secondary ?? {
    color: blue.value[500],
    onColor: whiteColor,
  }
  const tertiary: ColorPairToken = config.color.tertiary ?? {
    color: tertiaryDarkColor,
    onColor: whiteColor,
  }
  const positive: ColorPairToken = config.color.positive ?? {
    color: green.value[700],
    onColor: whiteColor,
  }
  const warning: ColorPairToken = config.color.warning ?? {
    color: orange.value[500],
    onColor: whiteColor,
  }
  const negative: ColorPairToken = config.color.negative ?? {
    color: red.value[600],
    onColor: whiteColor,
  }
  const neutral: ColorPairToken = {
    color: gray.value[750],
    onColor: whiteColor,
  }
  const background: ColorPairToken = config.color.background ?? {
    color: gray.value[850],
    onColor: gray.value[100],
  }
  const surface: ColorPairToken = config.color.surface ?? {
    color: gray.value[800],
    onColor: gray.value[100],
  }
  const surfaceVariant: ColorPairToken = config.color.surfaceVariant ?? {
    color: gray.value[900],
    onColor: gray.value[100],
  }
  const disabled: ColorPairToken = config.color.disabled ?? {
    color: gray.value[500],
    onColor: gray.value[300],
  }
  const overlay = config.color.overlay ?? '#00000060'

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
        color: 0.3,
        onColor: 0.95,
      },
      transparent: {
        color: 0.4,
        onColor: 1,
      },
    }),
  }
}
