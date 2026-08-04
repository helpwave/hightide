import type { ColorToken } from '../primitive-tokens/color'
import { hightidePrimitiveTokens } from '../primitive-tokens/hightide'
import type { HightideColorPalettes } from '../primitive-tokens/color'
import type { ThemeTokensModeConfig } from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'
import {
  buildColorTokens,
  defaultDarkElevationTokens,
  defaultTintConfig,
  expandRoleColor,
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
  transparent,
} = palettes

export const createDarkThemeTokens = (
  config: ThemeTokensModeConfig
): ThemeTokens => {
  const tintConfig = config.colors.tintConfig ?? defaultTintConfig
  const whiteColor = white.value as ColorToken

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
      color: tertiaryDarkColor,
      onColor: whiteColor,
    },
    tintConfig
  )
  const positive = expandRoleColor(
    config.colors.positive ?? {
      color: green.value[700],
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
      color: gray.value[750],
      onColor: whiteColor,
    },
    tintConfig,
    gray.value[600]
  )

  const background = config.colors.background ?? {
    color: gray.value[850],
    onColor: gray.value[100],
  }
  const surface = config.colors.surface ?? {
    color: gray.value[800],
    onColor: gray.value[100],
  }

  return {
    color: buildColorTokens({
      transparent: transparent.value,
      background,
      surface,
      surfaceHover: gray.value[700],
      surfaceVariant: gray.value[900],
      disabled: gray.value[500],
      onDisabled: gray.value[300],
      subtle: config.colors.subtle ?? gray.value[400],
      faded: config.colors.faded ?? gray.value[600],
      primary,
      secondary,
      tertiary,
      positive,
      warning,
      negative,
      neutral,
    }),
    ...resolveSharedGroups(config, defaultDarkElevationTokens()),
  }
}
