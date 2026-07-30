import type { ColorToken } from '../primitive/color'
import type { ColorState } from '../theme/color-state'
import type { StateBasedProperty } from '../theme/state-based-property'
import type {
  ThemeColorTokens,
  ThemeRoleColorToken
} from '../theme/color'

export const coloringTypes = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringType = typeof coloringTypes[number]

export type ColoringStyleBase = 'outline' | 'filled' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'

export type ButtonColoringStyle = ColoringStyle
export type ChipColoringStyle = ColoringStyleBase

export type ColorScheme = {
  'filled': StateBasedProperty<ColorState>,
  'outline': StateBasedProperty<ColorState>,
  'tonal': StateBasedProperty<ColorState>,
  'tonal-outline': StateBasedProperty<ColorState>,
  'text': StateBasedProperty<ColorState>,
}

export type ColorSchemes = Record<ColoringType, ColorScheme>

const createFilled = (
  role: ThemeRoleColorToken,
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
  hover: { background: role.emphasis },
  pressed: { background: role.emphasis },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: transparent,
  },
})

const createOutline = (
  role: ThemeRoleColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: transparent,
    foreground: role.color,
    border: role.color,
  },
  focused: undefined,
  hover: {
    foreground: role.emphasis,
    border: role.emphasis,
  },
  pressed: {
    foreground: role.emphasis,
    border: role.emphasis,
  },
  disabled: {
    background: transparent,
    foreground: onDisabled,
    border: disabled,
  },
})

const createText = (
  role: ThemeRoleColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: transparent,
    foreground: role.color,
    border: transparent,
  },
  focused: undefined,
  hover: { foreground: role.emphasis },
  pressed: { foreground: role.emphasis },
  disabled: {
    background: transparent,
    foreground: onDisabled,
    border: transparent,
  },
})

const createTonal = (
  role: ThemeRoleColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: role.tint,
    foreground: role.color,
    border: transparent,
  },
  focused: undefined,
  hover: { background: role.tintEmphasis },
  pressed: { background: role.tintEmphasis },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: transparent,
  },
})

const createTonalOutline = (
  role: ThemeRoleColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken
): StateBasedProperty<ColorState> => ({
  base: {
    background: role.tint,
    foreground: role.color,
    border: role.color,
  },
  focused: undefined,
  hover: {
    background: role.tintEmphasis,
    border: role.emphasis,
  },
  pressed: {
    background: role.tintEmphasis,
    border: role.emphasis,
  },
  disabled: {
    background: disabled,
    foreground: onDisabled,
    border: disabled,
  },
})

const schemeFor = (
  role: ThemeRoleColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): ColorScheme => ({
  'filled': createFilled(role, disabled, onDisabled, transparent),
  'outline': createOutline(role, disabled, onDisabled, transparent),
  'tonal': createTonal(role, disabled, onDisabled, transparent),
  'tonal-outline': createTonalOutline(role, disabled, onDisabled),
  'text': createText(role, disabled, onDisabled, transparent),
})

export const createColorSchemes = (colors: ThemeColorTokens): ColorSchemes => {
  const { disabled, onDisabled, transparent } = colors

  return {
    primary: schemeFor(colors.primary, disabled, onDisabled, transparent),
    secondary: schemeFor(colors.secondary, disabled, onDisabled, transparent),
    positive: schemeFor(colors.positive, disabled, onDisabled, transparent),
    warning: schemeFor(colors.warning, disabled, onDisabled, transparent),
    negative: schemeFor(colors.negative, disabled, onDisabled, transparent),
    neutral: schemeFor(colors.neutral, disabled, onDisabled, transparent),
  }
}
