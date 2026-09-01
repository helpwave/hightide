import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import type { ColorPairToken, ThemeTokensModeConfig } from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultLightElevationTokens,
  defaultTintConfig,
  resolveSharedGroups,
  tertiaryLightColor
} from './defaults'

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
): ThemeTokens => {
  const tintConfig = config.color.tintConfig ?? defaultTintConfig
  const whiteColor = white.value
  const blackColor = black.value

  const primary = config.color.primary
  const secondary: ColorPairToken = config.color.secondary ?? {
    color: blue.value[500],
    onColor: whiteColor,
  }
  const tertiary: ColorPairToken = config.color.tertiary ?? {
    color: tertiaryLightColor,
    onColor: whiteColor,
  }
  const positive: ColorPairToken = config.color.positive ?? {
    color: green.value[500],
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
    color: gray.value[150],
    onColor: blackColor,
  }
  const background: ColorPairToken = config.color.background ?? {
    color: gray.value[75],
    onColor: gray.value[900],
  }
  const surface: ColorPairToken = config.color.surface ?? {
    color: gray.value[25],
    onColor: gray.value[900],
  }
  const surfaceVariant: ColorPairToken = config.color.surfaceVariant ?? {
    color: whiteColor,
    onColor: gray.value[900],
  }
  const disabled: ColorPairToken = config.color.disabled ?? {
    color: gray.value[300],
    onColor: gray.value[500],
  }
  const overlay = config.color.overlay ?? '#00000039'

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
        color: 0.95,
        onColor: 0.2,
      },
      transparent: {
        color: 0.3,
        onColor: 1,
      },
    }),
  }
}
