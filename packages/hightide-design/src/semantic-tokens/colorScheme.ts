import type { ColorToken } from '../primitive-tokens/color'
import type {
  HightideThemeColorTokens,
  HightideThemeRoleColorToken
} from '../theme-tokens/color'

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

export type HightideColorScheme = {
  'filled': SemanticStateProperty<ColorState>,
  'outline': SemanticStateProperty<ColorState>,
  'tonal': SemanticStateProperty<ColorState>,
  'tonal-outline': SemanticStateProperty<ColorState>,
  'text': SemanticStateProperty<ColorState>,
}

export type HightideColorSchemes = Record<ColoringType, HightideColorScheme>

const createFilled = (
  role: HightideThemeRoleColorToken
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
  role: HightideThemeRoleColorToken
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
  role: HightideThemeRoleColorToken,
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
  role: HightideThemeRoleColorToken
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
  role: HightideThemeRoleColorToken
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
  role: HightideThemeRoleColorToken,
  transparent: ColorToken
): HightideColorScheme => ({
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
): HightideColorScheme => {
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

export const createHightideColorSchemes = (colors: HightideThemeColorTokens): HightideColorSchemes => {
  const { disabled, onDisabled, transparent } = colors

  return {
    primary: schemeFor(colors.primary, transparent),
    secondary: schemeFor(colors.secondary, transparent),
    positive: schemeFor(colors.positive, transparent),
    warning: schemeFor(colors.warning, transparent),
    negative: schemeFor(colors.negative, transparent),
    neutral: schemeFor(colors.neutral, transparent),
    disabled: disabledScheme(disabled, onDisabled, transparent),
  }
}
