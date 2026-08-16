import type { ColorToken } from '../primitive-tokens/color'
import type {
  PressableState,
  PressableStateValue
} from '../component-token-resolvers/pressable-tokens'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { StateBasedProperty } from '../theme-tokens/stateBasedProperty'
import { resolveStateBasedProperty } from '../theme-tokens/stateBasedProperty'
import { HexColorUtils } from '../utils/hex'
import {
  mapButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle
} from './coloring-style'
import type {
  ColoringColorVariant,
  ColoringStyle,
  ColoringToken,
  PressableColoringTokens,
  ButtonVariant
} from './types'

export const createColoringProperty = (
  themeTokens: ThemeTokens,
  coloring: ColoringToken,
  variant: ColoringColorVariant,
  style: ColoringStyle
): StateBasedProperty<ColoringColorVariant | PressableStateValue, ColoringToken> => {
  const { surface, disabled } = themeTokens.color

  return {
    base: {
      background: coloring.background,
      foreground: coloring.foreground,
      accent: coloring.accent,
    },
    overrides: [
      {
        condition: new Set(['disabled']),
        value: resolveColoringStyle({
          themeTokens,
          coloring: resolveColoringColorVariant({
            themeTokens,
            colorPair: disabled,
            variant,
          }),
          style,
        }),
      },
      {
        condition: new Set(['disabled', 'tonal']),
        value: {
          background: HexColorUtils.blend(surface.color, HexColorUtils.hexWithAlpha(disabled.color, 0.8)),
          foreground: HexColorUtils.blend(surface.onColor, HexColorUtils.hexWithAlpha(disabled.onColor, 0.8)),
          accent: HexColorUtils.blend(surface.color, HexColorUtils.hexWithAlpha(disabled.color, 0.8)),
        },
      }
    ]
  }
}

export const createPressableColoringTokens = (
  coloring: ColoringToken
) : StateBasedProperty<ButtonVariant | PressableStateValue, PressableColoringTokens> => {
  return {
    base: {
      background: coloring.background,
      foreground: coloring.foreground,
      border: 'transparent',
      outline: 'transparent',
    },
    overrides: [
      {
        condition: new Set(['outlined']),
        value: {
          border: coloring.accent,
        }
      },
      {
        condition: new Set(['focusVisible']),
        value: {
          outline: coloring.accent,
        }
      },
    ]
  }
}

export type PressableStateLayerTintTokens = {
  tint: ColorToken,
}

export const createPressableStateLayerTintProperty = (
  themeTokens: ThemeTokens,
  color: ColorToken
): StateBasedProperty<PressableStateValue ,PressableStateLayerTintTokens> => {
  if (color === 'transparent') {
    return {
      base: { tint: 'transparent' },
    }
  }

  const { tintConfig } = themeTokens.color

  return {
    base: { tint: 'transparent' },
    overrides: [
      {
        condition: new Set(['hovered']),
        value: { tint: HexColorUtils.hexWithAlpha(color, tintConfig.light) },
      },
      {
        condition: new Set(['focusVisible']),
        value: { tint: HexColorUtils.hexWithAlpha(color, tintConfig.normal) },
      },
      {
        condition: new Set(['pressed']),
        value: { tint: HexColorUtils.hexWithAlpha(color, tintConfig.normal) },
      },
      {
        condition: new Set(['disabled']),
        value: { tint: 'transparent' }
      },
    ],
  }
}

export const resolvePressableStateLayerTint = (params: {
  themeTokens: ThemeTokens,
  states: PressableState,
  color: ColorToken,
}): ColorToken => (
  resolveStateBasedProperty(
    createPressableStateLayerTintProperty(params.themeTokens, params.color),
    params.states
  ).tint
)

export const resolvePressableColoring = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringToken,
  variant: ButtonVariant,
  state: PressableState,
}): PressableColoringTokens => {
  const { themeTokens, variant, state, coloring } = params
  const { colorVariant, style } = mapButtonVariant(variant)

  const resolvedColoring = resolveStateBasedProperty(
    createColoringProperty(themeTokens, coloring, colorVariant, style),
    new Set([...state, colorVariant, style])
  )

  return resolveStateBasedProperty(
    createPressableColoringTokens(resolvedColoring),
    new Set([...state, variant])
  )
}
