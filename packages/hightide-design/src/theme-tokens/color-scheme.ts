import type { ColorToken } from '../primitive-tokens/color'
import type { RoleColorToken, ThemeColorTokens, ThemeTokens } from './theme-tokens'

export type ColorState = {
  color: ColorToken,
  foreground: ColorToken,
}

export type ColorStateFull = ColorState & {
  border: ColorToken,
}

export type SemanticStateProperty<P> = {
  base: P,
  emphasisOverride: P,
}

export const colorSchemeTypes = [
  'primary',
  'secondary',
  'tertiary',
  'positive',
  'warning',
  'negative',
  'neutral',
  'disabled',
] as const

export type ColoringType = typeof colorSchemeTypes[number]

export type ColoringStyleBase = 'outline' | 'filled' | 'tonal' | 'tonal-outline'
export type ColoringStyle = ColoringStyleBase | 'text'

export type PressableColoringStyle = ColoringStyle
export type ContainerColoringStyle = ColoringStyleBase
export type ChipColoringStyle = ContainerColoringStyle

export type ThemeColorScheme = {
  'filled': SemanticStateProperty<ColorState>,
  'outline': SemanticStateProperty<ColorState>,
  'tonal': SemanticStateProperty<ColorState>,
  'tonal-outline': SemanticStateProperty<ColorState>,
  'text': SemanticStateProperty<ColorState>,
}

export type ThemeColorSchemeTokens = Record<ColoringType, ThemeColorScheme>

const createFilled = (
  role: RoleColorToken
): SemanticStateProperty<ColorState> => ({
  base: {
    color: role.color,
    foreground: role.onColor,
  },
  emphasisOverride: {
    color: role.emphasis,
    foreground: role.onColor,
  },
})

const createOutline = (
  role: RoleColorToken
): SemanticStateProperty<ColorState> => ({
  base: {
    color: role.color,
    foreground: role.color,
  },
  emphasisOverride: {
    color: role.emphasis,
    foreground: role.emphasis,
  },
})

const createText = (
  role: RoleColorToken,
  transparent: ColorToken
): SemanticStateProperty<ColorState> => ({
  base: {
    color: transparent,
    foreground: role.color,
  },
  emphasisOverride: {
    color: transparent,
    foreground: role.emphasis,
  },
})

const createTonal = (
  role: RoleColorToken
): SemanticStateProperty<ColorState> => ({
  base: {
    color: role.tint,
    foreground: role.color,
  },
  emphasisOverride: {
    color: role.tintEmphasis,
    foreground: role.color,
  },
})

const createTonalOutline = (
  role: RoleColorToken
): SemanticStateProperty<ColorState> => ({
  base: {
    color: role.tint,
    foreground: role.color,
  },
  emphasisOverride: {
    color: role.tintEmphasis,
    foreground: role.color,
  },
})

const schemeFor = (
  role: RoleColorToken,
  transparent: ColorToken
): ThemeColorScheme => ({
  'filled': createFilled(role),
  'outline': createOutline(role),
  'tonal': createTonal(role),
  'tonal-outline': createTonalOutline(role),
  'text': createText(role, transparent),
})

const disabledScheme = (
  disabled: ColorToken,
  onDisabled: ColorToken,
  transparent: ColorToken
): ThemeColorScheme => {
  const filledBase: ColorState = {
    color: disabled,
    foreground: onDisabled,
  }
  const outlineBase: ColorState = {
    color: disabled,
    foreground: onDisabled,
  }
  const textBase: ColorState = {
    color: transparent,
    foreground: onDisabled,
  }

  return {
    'filled': {
      base: filledBase,
      emphasisOverride: filledBase,
    },
    'outline': {
      base: outlineBase,
      emphasisOverride: outlineBase,
    },
    'tonal': {
      base: filledBase,
      emphasisOverride: filledBase,
    },
    'tonal-outline': {
      base: filledBase,
      emphasisOverride: filledBase,
    },
    'text': {
      base: textBase,
      emphasisOverride: textBase,
    },
  }
}

export const createColorSchemeTokens = (
  color: ThemeColorTokens
): ThemeColorSchemeTokens => {
  const { disabled, onDisabled, transparent } = color

  return {
    primary: schemeFor(color.primary, transparent),
    secondary: schemeFor(color.secondary, transparent),
    tertiary: schemeFor(color.tertiary, transparent),
    positive: schemeFor(color.positive, transparent),
    warning: schemeFor(color.warning, transparent),
    negative: schemeFor(color.negative, transparent),
    neutral: schemeFor(color.neutral, transparent),
    disabled: disabledScheme(disabled, onDisabled, transparent),
  }
}

export const createColorSchemeTokensFromThemeTokens = (
  themeTokens: ThemeTokens
): ThemeColorSchemeTokens => createColorSchemeTokens(themeTokens.color)
