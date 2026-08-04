import type { ColorToken } from '../primitive-tokens/color'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import type { ThemeTokensModeConfig } from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultLightElevationTokens,
  defaultTintConfig,
  expandRoleColor,
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
  transparent,
} = palettes

export const createLightThemeTokens = (
  config: ThemeTokensModeConfig
): ThemeTokens => {
  const tintConfig = config.colors.tintConfig ?? defaultTintConfig
  const whiteColor = white.value as ColorToken
  const blackColor = black.value as ColorToken

  const primary = expandRoleColor(
    config.colors.primary,
    tintConfig
  )
  const secondary = expandRoleColor(
    config.colors.secondary ?? {
      color: blue.value[500],
      onColor: whiteColor,
    },
    tintConfig,
    config.colors.secondary ? undefined : blue.value[600]
  )
  const tertiary = expandRoleColor(
    config.colors.tertiary ?? {
      color: tertiaryLightColor,
      onColor: whiteColor,
    },
    tintConfig
  )
  const positive = expandRoleColor(
    config.colors.positive ?? {
      color: green.value[500],
      onColor: whiteColor,
    },
    tintConfig,
    config.colors.positive ? undefined : green.value[600]
  )
  const warning = expandRoleColor(
    config.colors.warning ?? {
      color: orange.value[500],
      onColor: whiteColor,
    },
    tintConfig,
    config.colors.warning ? undefined : orange.value[600]
  )
  const negative = expandRoleColor(
    config.colors.negative ?? {
      color: red.value[500],
      onColor: whiteColor,
    },
    tintConfig,
    config.colors.negative ? undefined : red.value[600]
  )
  const neutral = expandRoleColor(
    {
      color: gray.value[150],
      onColor: blackColor,
    },
    tintConfig,
    gray.value[200]
  )

  const background = config.colors.background ?? {
    color: gray.value[75],
    onColor: gray.value[900],
  }
  const surface = config.colors.surface ?? {
    color: gray.value[25],
    onColor: gray.value[900],
  }

  return {
    color: buildColorTokens({
      transparent: transparent.value,
      background,
      surface,
      surfaceHover: whiteColor,
      surfaceVariant: whiteColor,
      disabled: gray.value[300],
      onDisabled: gray.value[500],
      subtle: config.colors.subtle ?? gray.value[600],
      faded: config.colors.faded ?? gray.value[200],
      primary,
      secondary,
      tertiary,
      positive,
      warning,
      negative,
      neutral,
    }),
    ...resolveSharedGroups(config, defaultLightElevationTokens()),
  }
}
