import {
  pressableVariants,
  toActivePressableStates
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  PressableVariant } from '@helpwave/hightide-design/semantic-token-resolvers'
import {
  mapPressableVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type {
  ColorPairToken,
  ThemeTokens
} from '@helpwave/hightide-design/theme-tokens'

import type { Color } from '../types/color'
import type { InteractionState } from '../types/resolver'

const colorSchemeKeys = [
  'primary',
  'secondary',
  'tertiary',
  'positive',
  'warning',
  'negative',
  'neutral',
  'disabled',
] as const

export type ResolvedColoringStyles = {
  backgroundColor: Color,
  color: Color,
  borderColor?: Color,
}

export type ColoringState = {
  color: Color,
  foreground: Color,
  border: Color,
}

export type ColoringStateProperty = {
  base: ColoringState,
  emphasisOverride: ColoringState,
}

export type HightideColorScheme = Record<PressableVariant, ColoringStateProperty>

export type HightideColorSchemes = {
  primary: HightideColorScheme,
  secondary: HightideColorScheme,
  tertiary: HightideColorScheme,
  positive: HightideColorScheme,
  warning: HightideColorScheme,
  negative: HightideColorScheme,
  neutral: HightideColorScheme,
  disabled: HightideColorScheme,
}

export const resolveColoringStyles = (
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  variant: PressableVariant,
  state: InteractionState = {}
): ResolvedColoringStyles => {
  const { colorVariant, style } = mapPressableVariant(variant)
  const coloring = resolveColoringStyle({
    coloring: resolveColoringColorVariant({
      colorPair,
      variant: colorVariant,
    }),
    style,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant,
    state: toActivePressableStates(state),
  })

  return {
    backgroundColor: resolved.background,
    color: resolved.foreground,
    borderColor: resolved.border !== 'transparent'
      ? resolved.border
      : resolved.outline !== 'transparent'
        ? resolved.outline
        : resolved.background,
  }
}

const toColoringState = (
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  variant: PressableVariant,
  state: InteractionState
): ColoringState => {
  const resolved = resolveColoringStyles(themeTokens, colorPair, variant, state)

  return {
    color: resolved.backgroundColor,
    foreground: resolved.color,
    border: resolved.borderColor ?? resolved.backgroundColor,
  }
}

export const createColorSchemes = (themeTokens: ThemeTokens): HightideColorSchemes => (
  Object.fromEntries(
    colorSchemeKeys.map((key) => [
      key,
      Object.fromEntries(
        pressableVariants.map((variant) => [
          variant,
          {
            base: toColoringState(themeTokens, themeTokens.color[key], variant, {}),
            emphasisOverride: toColoringState(
              themeTokens,
              themeTokens.color[key],
              variant,
              { isHovered: true }
            ),
          } satisfies ColoringStateProperty,
        ])
      ),
    ])
  ) as HightideColorSchemes
)

export const isOutlinedVariant = (
  variant: PressableVariant
): boolean => {
  return variant === 'outlined'
}
