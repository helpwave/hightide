import type { ColorToken } from '../primitive/color'
import type { HightideSemanticColorTokens } from '../semantic/hightide'
import type { ColorState } from './color-state'
import { HexColorUtils } from '../utils/hex'
import type { StateBasedProperty } from './state-based-property'

export const coloringTypes = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringType = typeof coloringTypes[number]

export type ColoringStyleBase = 'outline' | 'filled' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'

export type ButtonColoringStyle = ColoringStyle
export type ChipColoringStyle = ColoringStyleBase

export type ColorScheme = {
  filled: StateBasedProperty<ColorState>,
  outline: StateBasedProperty<ColorState>,
  tonal: StateBasedProperty<ColorState>,
  'tonal-outline': StateBasedProperty<ColorState>,
  text: StateBasedProperty<ColorState>,
}

export type ColorSchemes = Record<ColoringType, ColorScheme>

type RoleColors = {
  color: ColorToken,
  onColor: ColorToken,
  hover: ColorToken,
  text: ColorToken,
  textHover: ColorToken,
  outline: ColorToken,
  outlineHover: ColorToken,
  tonalText: ColorToken,
  tonalBackground: ColorToken,
}

const roleColorsFromTheme = (colors: HightideSemanticColorTokens): Record<ColoringType, RoleColors> => ({
  primary: {
    color: colors.primary,
    onColor: colors.onPrimary,
    hover: colors.primaryHover,
    text: colors.primary,
    textHover: colors.primaryHover,
    outline: colors.primary,
    outlineHover: colors.primaryHover,
    tonalText: colors.primary,
    tonalBackground: colors.primary,
  },
  secondary: {
    color: colors.secondary,
    onColor: colors.onSecondary,
    hover: colors.secondaryHover,
    text: colors.secondary,
    textHover: colors.secondaryHover,
    outline: colors.secondary,
    outlineHover: colors.secondaryHover,
    tonalText: colors.secondary,
    tonalBackground: colors.secondary,
  },
  positive: {
    color: colors.positive,
    onColor: colors.onPositive,
    hover: colors.positiveHover,
    text: colors.positive,
    textHover: colors.positiveHover,
    outline: colors.positive,
    outlineHover: colors.positiveHover,
    tonalText: colors.positive,
    tonalBackground: colors.positive,
  },
  warning: {
    color: colors.warning,
    onColor: colors.onWarning,
    hover: colors.warningHover,
    text: colors.warning,
    textHover: colors.warningHover,
    outline: colors.warning,
    outlineHover: colors.warningHover,
    tonalText: colors.warning,
    tonalBackground: colors.warning,
  },
  negative: {
    color: colors.negative,
    onColor: colors.onNegative,
    hover: colors.negativeHover,
    text: colors.negative,
    textHover: colors.negativeHover,
    outline: colors.negative,
    outlineHover: colors.negativeHover,
    tonalText: colors.negative,
    tonalBackground: colors.negative,
  },
  neutral: {
    color: colors.neutral,
    onColor: colors.onNeutral,
    hover: colors.neutralHover,
    text: colors.neutralText,
    textHover: colors.neutralTextHover,
    outline: colors.neutralOutline,
    outlineHover: colors.neutralOutlineHover,
    tonalText: colors.neutralTonalText,
    tonalBackground: colors.neutralTonalBackground,
  },
})

const createFilled = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: role.color,
    foreground: role.onColor,
    border: transparent,
  },
  focused: undefined,
  hover: { background: role.hover },
  pressed: { background: role.hover },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: transparent,
  },
})

const createOutline = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: transparent,
    foreground: role.outline,
    border: role.outline,
  },
  focused: undefined,
  hover: {
    foreground: role.outlineHover,
    border: role.outlineHover,
  },
  pressed: {
    foreground: role.outlineHover,
    border: role.outlineHover,
  },
  disabled: {
    background: transparent,
    foreground: onDisabled,
    border: disabled,
  },
})

const createText = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: transparent,
    foreground: role.text,
    border: transparent,
  },
  focused: undefined,
  hover: { foreground: role.textHover },
  pressed: { foreground: role.textHover },
  disabled: {
    background: transparent,
    foreground: onDisabled,
    border: transparent,
  },
})

const createTonal = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.2),
    foreground: role.tonalText,
    border: transparent,
  },
  focused: undefined,
  hover: { background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.28) },
  pressed: { background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.28) },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: transparent,
  },
})

const createTonalOutline = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.2),
    foreground: role.tonalText,
    border: role.outline,
  },
  focused: undefined,
  hover: {
    background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.28),
    border: role.outlineHover,
  },
  pressed: {
    background: HexColorUtils.hexWithAlpha(role.tonalBackground, 0.28),
    border: role.outlineHover,
  },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: disabled,
  },
})

const schemeFor = (
  role: RoleColors,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): ColorScheme => ({
  filled: createFilled(role, disabled, onDisabled, transparent),
  outline: createOutline(role, disabled, onDisabled, transparent),
  tonal: createTonal(role, disabled, onDisabled, transparent),
  'tonal-outline': createTonalOutline(role, disabled, onDisabled),
  text: createText(role, disabled, onDisabled, transparent),
})

export const createColorSchemes = (colors: HightideSemanticColorTokens): ColorSchemes => {
  const roles = roleColorsFromTheme(colors)
  const { disabled, onDisabled, transparent } = colors

  return {
    primary: schemeFor(roles.primary, disabled, onDisabled, transparent),
    secondary: schemeFor(roles.secondary, disabled, onDisabled, transparent),
    positive: schemeFor(roles.positive, disabled, onDisabled, transparent),
    warning: schemeFor(roles.warning, disabled, onDisabled, transparent),
    negative: schemeFor(roles.negative, disabled, onDisabled, transparent),
    neutral: schemeFor(roles.neutral, disabled, onDisabled, transparent),
  }
}
