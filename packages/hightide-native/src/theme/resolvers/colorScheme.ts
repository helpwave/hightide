import {
  pressableColoringStyles,
  toActivePressableStates
} from '@helpwave/hightide-design/component-token-resolvers'
import {
  resolveColoringStyle,
  resolvePressableColoring
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type {
  ColoringStyle,
  ColorPairToken,
  ContainerColoringStyle,
  PressableColoringStyle,
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

export type HightideColorScheme = Record<PressableColoringStyle, ColoringStateProperty>

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
  coloringStyle: ColoringStyle,
  state: InteractionState = {}
): ResolvedColoringStyles => {
  const coloring = resolveColoringStyle({
    themeTokens,
    colorPair,
    style: coloringStyle,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    style: coloringStyle,
    state: toActivePressableStates(state),
  })

  return {
    backgroundColor: resolved.background,
    color: resolved.text,
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
  coloringStyle: PressableColoringStyle,
  state: InteractionState
): ColoringState => {
  const resolved = resolveColoringStyles(themeTokens, colorPair, coloringStyle, state)

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
        pressableColoringStyles.map((coloringStyle) => [
          coloringStyle,
          {
            base: toColoringState(themeTokens, themeTokens.color[key], coloringStyle, {}),
            emphasisOverride: toColoringState(
              themeTokens,
              themeTokens.color[key],
              coloringStyle,
              { isHovered: true }
            ),
          } satisfies ColoringStateProperty,
        ])
      ),
    ])
  ) as HightideColorSchemes
)

export const isOutlineColoringStyle = (
  coloringStyle: PressableColoringStyle | ContainerColoringStyle
): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}
