import type {
  ColorState,
  ColorStateFull,
  ColoringType,
  PressableColoringStyle,
  ThemeColorSchemeTokens
} from '../theme-tokens/color-scheme'
import { colorSchemeTypes } from '../theme-tokens/color-scheme'
import type { ColorToken } from '../primitive-tokens/color'
import type { StateBasedProperty } from '../theme-tokens/stateBasedProperty'

export type PressableState = 'disabled' | 'focused' | 'hovered' | 'pressed'

export type PressableInteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isPressed?: boolean,
}

export type PressableStateBasedProperty<P> = StateBasedProperty<PressableState, P>

export const toActivePressableStates = (
  state: PressableInteractionState
): ReadonlySet<PressableState> => {
  const active = new Set<PressableState>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }

  return active
}

export type PressableColorScheme = Record<PressableColoringStyle, PressableStateBasedProperty<ColorStateFull>>

export type PressableColorSchemes = Record<ColoringType, PressableColorScheme>

export const pressableColoringStyles = [
  'filled',
  'outline',
  'tonal',
  'tonal-outline',
  'text',
] as const satisfies readonly PressableColoringStyle[]

export const toColorStateFull = (
  state: ColorState,
  style: PressableColoringStyle,
  transparent: ColorToken
): ColorStateFull => {
  if (style === 'outline') {
    return {
      color: transparent,
      foreground: state.foreground,
      border: state.color,
    }
  }

  if (style === 'text') {
    return {
      color: transparent,
      foreground: state.foreground,
      border: transparent,
    }
  }

  if (style === 'tonal-outline') {
    return {
      color: state.color,
      foreground: state.foreground,
      border: state.foreground,
    }
  }

  return {
    color: state.color,
    foreground: state.foreground,
    border: state.color,
  }
}

const toPressableStateBasedProperty = (
  property: { base: ColorState, emphasisOverride: ColorState },
  style: PressableColoringStyle,
  colorSchemes: ThemeColorSchemeTokens,
  transparent: ColorToken
): PressableStateBasedProperty<ColorStateFull> => ({
  base: toColorStateFull(property.base, style, transparent),
  overrides: [
    { condition: ['hovered'], value: toColorStateFull(property.emphasisOverride, style, transparent) },
    { condition: ['pressed'], value: toColorStateFull(property.emphasisOverride, style, transparent) },
    { condition: ['disabled'], value: toColorStateFull(colorSchemes.disabled[style].base, style, transparent) },
  ],
})

export const toPressableColorSchemes = (
  colorSchemes: ThemeColorSchemeTokens
): PressableColorSchemes => {
  const transparent = colorSchemes.primary.text.base.color

  return Object.fromEntries(
    colorSchemeTypes.map((type) => [
      type,
      Object.fromEntries(
        pressableColoringStyles.map((style) => [
          style,
          toPressableStateBasedProperty(colorSchemes[type][style], style, colorSchemes, transparent),
        ])
      ),
    ])
  ) as PressableColorSchemes
}
