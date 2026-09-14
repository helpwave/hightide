import { TokenBuilder } from '../../utils'
import type { ColorToken } from '../../primitive-tokens/color-token'
import type { HexColor } from '../../utils/hex-color'
import type { NumberToken } from '../../primitive-tokens/number-token'
import { hightideTypography } from '../../primitive-tokens/hightide/typography'
import type { ShadowLayoutToken } from '../../primitive-tokens/shadow-layout-token'
import { hightideShadow } from '../../primitive-tokens/hightide/shadow'
import { HexColorUtils } from '../../utils/hex'
import type {
  ColorPairToken,
  OutlineToken,
  ThemeTokensModeConfig,
  TintConfig
} from '../create/theme-tokens-config'
import type {
  ThemeAppearancePercentages,
  ThemeBorderRadiusTokens,
  ThemeBorderWidthTokens,
  ThemeColorTokens,
  ThemeElevationTokens,
  ThemeFontFamilyTokens,
  ThemeFontSizingTokens,
  ThemeFontWeightTokens,
  ThemeIcongraphyTokens,
  ThemeMotionTokens,
  ThemePaddingTokens,
  ThemeSizeTokens,
  ThemeSpacingTokens,
  HightideThemeTokens,
  ThemeTypographyTokens
} from './theme-tokens'
import { wrapFontSizing } from '../create/wrap'

export const defaultTintConfig: TintConfig = {
  light: TokenBuilder.number(0.08),
  normal: TokenBuilder.number(0.16),
  strong: TokenBuilder.number(0.20),
}

export const tertiaryLightColor = '#057986' as const satisfies HexColor
export const tertiaryDarkColor = HexColorUtils.mixWithWhite(tertiaryLightColor, 0.35)

export const defaultFontFamilyTokens = (): ThemeFontFamilyTokens => ({
  default: hightideTypography.fontFamily.inter,
  accent: hightideTypography.fontFamily.spaceGrotesk,
  mono: hightideTypography.fontFamily.inter,
})

export const defaultFontWeightTokens = (): ThemeFontWeightTokens => ({
  thin: TokenBuilder.number(hightideTypography.fontWeight.thin.value),
  light: TokenBuilder.number(hightideTypography.fontWeight.light.value),
  base: TokenBuilder.number(hightideTypography.fontWeight.base.value),
  medium: TokenBuilder.number(hightideTypography.fontWeight.medium.value),
  semibold: TokenBuilder.number(hightideTypography.fontWeight.semibold.value),
  bold: TokenBuilder.number(hightideTypography.fontWeight.bold.value),
})

export const defaultFontSizingTokens = (): ThemeFontSizingTokens => ({
  'xs': wrapFontSizing(hightideTypography.fontSizing.xs),
  'sm': wrapFontSizing(hightideTypography.fontSizing.sm),
  'base': wrapFontSizing(hightideTypography.fontSizing.base),
  'lg': wrapFontSizing(hightideTypography.fontSizing.lg),
  'xl': wrapFontSizing(hightideTypography.fontSizing.xl),
  '2xl': wrapFontSizing(hightideTypography.fontSizing['2xl']),
  '3xl': wrapFontSizing(hightideTypography.fontSizing['3xl']),
  '4xl': wrapFontSizing(hightideTypography.fontSizing['4xl']),
  '5xl': wrapFontSizing(hightideTypography.fontSizing['5xl']),
  '6xl': wrapFontSizing(hightideTypography.fontSizing['6xl']),
  '7xl': wrapFontSizing(hightideTypography.fontSizing['7xl']),
  '8xl': wrapFontSizing(hightideTypography.fontSizing['8xl']),
  '9xl': wrapFontSizing(hightideTypography.fontSizing['9xl']),
})

export const defaultTypographyTokens = (
  fontSizing: ThemeFontSizingTokens,
  fontWeights: ThemeFontWeightTokens,
  fontFamilies: ThemeFontFamilyTokens
): ThemeTypographyTokens => ({
  display: {
    ...fontSizing['4xl'],
    fontWeight: fontWeights.bold,
    fontFamily: fontFamilies.accent,
  },
  heading: {
    lg: {
      ...fontSizing['2xl'],
      fontWeight: fontWeights.semibold,
      fontFamily: fontFamilies.accent,
    },
    md: {
      ...fontSizing.lg,
      fontWeight: fontWeights.semibold,
      fontFamily: fontFamilies.accent,
    },
    sm: {
      ...fontSizing.base,
      fontWeight: fontWeights.medium,
      fontFamily: fontFamilies.accent,
    },
  },
  body: {
    lg: {
      ...fontSizing.lg,
      fontWeight: fontWeights.base,
      fontFamily: fontFamilies.default,
    },
    md: {
      ...fontSizing.base,
      fontWeight: fontWeights.base,
      fontFamily: fontFamilies.default,
    },
    sm: {
      ...fontSizing.sm,
      fontWeight: fontWeights.base,
      fontFamily: fontFamilies.default,
    },
  },
  label: {
    lg: {
      ...fontSizing.lg,
      fontWeight: fontWeights.semibold,
      fontFamily: fontFamilies.default,
    },
    md: {
      ...fontSizing.base,
      fontWeight: fontWeights.semibold,
      fontFamily: fontFamilies.default,
    },
    sm: {
      ...fontSizing.sm,
      fontWeight: fontWeights.medium,
      fontFamily: fontFamilies.default,
    },
  },
})

export const defaultSizeTokens = (): ThemeSizeTokens => ({
  xs: TokenBuilder.number(28),
  sm: TokenBuilder.number(36),
  md: TokenBuilder.number(48),
  lg: TokenBuilder.number(60),
  xl: TokenBuilder.number(72),
})

export const defaultIcongraphyTokens = (): ThemeIcongraphyTokens => ({
  sizes: {
    xs: TokenBuilder.number(16),
    sm: TokenBuilder.number(20),
    md: TokenBuilder.number(24),
    lg: TokenBuilder.number(32),
    xl: TokenBuilder.number(48),
  },
  strokeWidth: TokenBuilder.number(2),
})

export const defaultSpacingTokens = (): ThemeSpacingTokens => ({
  xxs: TokenBuilder.number(1),
  xs: TokenBuilder.number(2),
  sm: TokenBuilder.number(4),
  md: TokenBuilder.number(8),
  lg: TokenBuilder.number(16),
  xl: TokenBuilder.number(24),
  xxl: TokenBuilder.number(32),
})

export const defaultBorderRadiusTokens = (): ThemeBorderRadiusTokens => ({
  xxs: TokenBuilder.number(2),
  xs: TokenBuilder.number(4),
  sm: TokenBuilder.number(6),
  md: TokenBuilder.number(8),
  lg: TokenBuilder.number(10),
  xl: TokenBuilder.number(14),
  xxl: TokenBuilder.number(18),
})

export const defaultPaddingTokens = (): ThemePaddingTokens => ({
  xs: TokenBuilder.number(2),
  sm: TokenBuilder.number(4),
  md: TokenBuilder.number(6),
  lg: TokenBuilder.number(10),
  xl: TokenBuilder.number(14),
})

export const defaultBorderWidthTokens = (): ThemeBorderWidthTokens => ({
  thin: TokenBuilder.number(1),
  normal: TokenBuilder.number(2),
  thick: TokenBuilder.number(4),
})

export const defaultMotionTokens = (): ThemeMotionTokens => ({
  durations: {
    fast: TokenBuilder.number(100),
    normal: TokenBuilder.number(200),
    slow: TokenBuilder.number(300),
  },
})

const withShadowColor = (
  layout: ShadowLayoutToken,
  color: HexColor
) => ({
  x: layout.x,
  y: layout.y,
  blur: layout.blur,
  spread: layout.spread,
  color: TokenBuilder.color(color),
})

export const defaultLightElevationTokens = (): ThemeElevationTokens => {
  const sizes = hightideShadow.layout.bottom

  return {
    level1: withShadowColor(sizes.xs, '#0000000F'),
    level2: withShadowColor(sizes.sm, '#0000001A'),
    level3: withShadowColor(sizes.md, '#00000024'),
    level4: withShadowColor(sizes.lg, '#0000002E'),
    level5: withShadowColor(sizes.xl, '#00000038'),
  }
}

export const defaultDarkElevationTokens = (): ThemeElevationTokens => {
  const sizes = hightideShadow.layout.bottom

  return {
    level1: withShadowColor(sizes.xs, '#FFFFFF0A'),
    level2: withShadowColor(sizes.sm, '#FFFFFF0F'),
    level3: withShadowColor(sizes.md, '#FFFFFF14'),
    level4: withShadowColor(sizes.lg, '#FFFFFF1A'),
    level5: withShadowColor(sizes.xl, '#FFFFFF24'),
  }
}

export const mergeTypography = (
  defaults: ThemeTypographyTokens,
  override?: ThemeTokensModeConfig['typography']
): ThemeTypographyTokens => {
  if (!override) {
    return defaults
  }

  return {
    display: override.display ?? defaults.display,
    heading: {
      ...defaults.heading,
      ...override.heading,
    },
    body: {
      ...defaults.body,
      ...override.body,
    },
    label: {
      ...defaults.label,
      ...override.label,
    },
  }
}

export const defaultAppearancePercentages = (): ThemeAppearancePercentages => ({
  normal: TokenBuilder.number(1),
  subtle: TokenBuilder.number(0.7),
  faded: TokenBuilder.number(0.4),
})

export const defaultFocusOutlineToken = (): OutlineToken => ({
  width: TokenBuilder.number(2),
  offset: TokenBuilder.number(2),
  style: TokenBuilder.outlineStyle('solid'),
})

export const buildColorTokens = (params: {
  tintConfig: TintConfig,
  background: ColorPairToken,
  surface: ColorPairToken,
  surfaceVariant: ColorPairToken,
  disabled: ColorPairToken,
  primary: ColorPairToken,
  secondary: ColorPairToken,
  tertiary: ColorPairToken,
  positive: ColorPairToken,
  warning: ColorPairToken,
  negative: ColorPairToken,
  neutral: ColorPairToken,
  overlay: ColorToken,
}): ThemeColorTokens => ({
  tintConfig: params.tintConfig,
  background: params.background,
  surface: params.surface,
  surfaceVariant: params.surfaceVariant,
  surfaceInverse: {
    color: params.surface.onColor,
    onColor: params.surface.color,
  },
  disabled: params.disabled,
  primary: params.primary,
  secondary: params.secondary,
  tertiary: params.tertiary,
  positive: params.positive,
  warning: params.warning,
  negative: params.negative,
  neutral: params.neutral,
  border: TokenBuilder.color(HexColorUtils.blend(
    params.surface.color.value,
    HexColorUtils.hexWithAlpha(params.surface.onColor.value, 0.25)
  )),
  overlay: params.overlay,
})

export const resolveSharedGroups = (
  config: ThemeTokensModeConfig,
  elevationDefaults: ThemeElevationTokens,
  coloringDefaults: {
    tonal: { color: NumberToken, onColor: NumberToken },
    transparent: { color: NumberToken, onColor: NumberToken },
  }
): Omit<HightideThemeTokens, 'color'> => {
  const appearanceDefaults = defaultAppearancePercentages()
  const focusOutlineDefaults = defaultFocusOutlineToken()
  const icongraphyDefaults = defaultIcongraphyTokens()
  const fontSizingDefaults = defaultFontSizingTokens()
  const fontSizing: ThemeFontSizingTokens = {
    ...fontSizingDefaults,
    ...config.fontSizing,
  }
  const fontWeights: ThemeFontWeightTokens = {
    ...defaultFontWeightTokens(),
    ...config.fontWeights,
  }
  const fontFamilies = {
    ...defaultFontFamilyTokens(),
    ...config.fontFamilies,
  }

  const mergeNumberPartial = <K extends string>(
    defaults: Record<K, NumberToken>,
    override?: Partial<Record<K, NumberToken>>
  ): Record<K, NumberToken> => ({
      ...defaults,
      ...override,
    })

  return {
    fontFamilies,
    fontWeights,
    fontSizing,
    typography: mergeTypography(
      defaultTypographyTokens(fontSizing, fontWeights, fontFamilies),
      config.typography
    ),
    icongraphy: {
      sizes: mergeNumberPartial(icongraphyDefaults.sizes, config.icongraphy?.sizes),
      strokeWidth: config.icongraphy?.strokeWidth ?? icongraphyDefaults.strokeWidth,
    },
    size: mergeNumberPartial(defaultSizeTokens(), config.size),
    spacing: mergeNumberPartial(defaultSpacingTokens(), config.spacing),
    padding: mergeNumberPartial(defaultPaddingTokens(), config.padding),
    borderRadius: mergeNumberPartial(defaultBorderRadiusTokens(), config.borderRadius),
    borderWidth: mergeNumberPartial(defaultBorderWidthTokens(), config.borderWidth),
    elevation: {
      ...elevationDefaults,
      ...config.elevation,
    },
    motion: {
      durations: mergeNumberPartial(defaultMotionTokens().durations, config.motion?.durations),
    },
    focusOutline: {
      ...focusOutlineDefaults,
      ...config.focusOutline,
    },
    config: {
      coloring: {
        tonal: {
          color: config.config?.coloring?.tonal?.color ?? coloringDefaults.tonal.color,
          onColor: config.config?.coloring?.tonal?.onColor ?? coloringDefaults.tonal.onColor,
        },
        transparent: {
          color: config.config?.coloring?.transparent?.color ?? coloringDefaults.transparent.color,
          onColor: config.config?.coloring?.transparent?.onColor ?? coloringDefaults.transparent.onColor,
        },
      },
      appearancePercentages: {
        normal: config.config?.appearancePercentages?.normal ?? appearanceDefaults.normal,
        subtle: config.config?.appearancePercentages?.subtle ?? appearanceDefaults.subtle,
        faded: config.config?.appearancePercentages?.faded ?? appearanceDefaults.faded,
      },
    },
  }
}
