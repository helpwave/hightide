import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import { hightideTypography } from '../primitive-tokens/typography'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import { hightideShadow } from '../primitive-tokens/shadow'
import { HexColorUtils } from '../utils/hex'
import type {
  ColorPairToken,
  ThemeTokensModeConfig,
  TintConfig
} from './theme-tokens-config'
import type {
  ColoringConfigTokens,
  OutlineToken,
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
  ThemeTokens,
  ThemeTypographyTokens
} from './theme-tokens'

export const defaultTintConfig: TintConfig = {
  light: 0.08,
  normal: 0.16,
  strong: 0.20,
}

export const tertiaryLightColor = '#057986' as const satisfies HexColorToken
export const tertiaryDarkColor = HexColorUtils.mixWithWhite(tertiaryLightColor, 0.35)

export const defaultFontFamilyTokens = (): ThemeFontFamilyTokens => ({
  default: hightideTypography.fontFamily.inter,
  accent: hightideTypography.fontFamily.spaceGrotesk,
  mono: hightideTypography.fontFamily.inter,
})

export const defaultFontWeightTokens = (): ThemeFontWeightTokens => ({
  thin: hightideTypography.fontWeight.thin,
  light: hightideTypography.fontWeight.light,
  base: hightideTypography.fontWeight.base,
  medium: hightideTypography.fontWeight.medium,
  semibold: hightideTypography.fontWeight.semibold,
  bold: hightideTypography.fontWeight.bold,
})

export const defaultFontSizingTokens = (): ThemeFontSizingTokens => ({
  ...hightideTypography.fontSizing,
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
  xs: 28,
  sm: 36,
  md: 48,
  lg: 60,
  xl: 72,
})

export const defaultIcongraphyTokens = (): ThemeIcongraphyTokens => ({
  sizes: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  strokeWidth: 2,
})

export const defaultSpacingTokens = (): ThemeSpacingTokens => ({
  xxs: 1,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  xxl: 32,
})

export const defaultBorderRadiusTokens = (): ThemeBorderRadiusTokens => ({
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  xxl: 18,
})

export const defaultPaddingTokens = (): ThemePaddingTokens => ({
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
})

export const defaultBorderWidthTokens = (): ThemeBorderWidthTokens => ({
  thin: 1,
  normal: 2,
  thick: 4,
})

export const defaultMotionTokens = (): ThemeMotionTokens => ({
  durations: {
    fast: 100,
    normal: 200,
    slow: 300,
  },
})

const withShadowColor = (
  layout: ShadowLayoutToken,
  color: ColorToken
): ShadowLayoutToken & { color: ColorToken } => ({
  ...layout,
  color,
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
  normal: 1,
  subtle: 0.7,
  faded: 0.4,
})

export const defaultFocusOutlineToken = (): OutlineToken => ({
  width: 2,
  offset: 2,
  style: 'solid',
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
  border: HexColorUtils.blend(params.surface.color, HexColorUtils.hexWithAlpha(params.surface.onColor, 0.25)),
})

export const resolveSharedGroups = (
  config: ThemeTokensModeConfig,
  elevationDefaults: ThemeElevationTokens,
  coloringDefaults: ColoringConfigTokens
): Omit<ThemeTokens, 'color'> => {
  const appearanceDefaults = defaultAppearancePercentages()
  const focusOutlineDefaults = defaultFocusOutlineToken()
  const icongraphyDefaults = defaultIcongraphyTokens()
  const fontSizing = {
    ...defaultFontSizingTokens(),
    ...config.fontSizing,
  }
  const fontWeights = {
    ...defaultFontWeightTokens(),
    ...config.fontWeights,
  }
  const fontFamilies = {
    ...defaultFontFamilyTokens(),
    ...config.fontFamilies,
  }

  return {
    fontFamilies,
    fontWeights,
    fontSizing,
    typography: mergeTypography(
      defaultTypographyTokens(fontSizing, fontWeights, fontFamilies),
      config.typography
    ),
    icongraphy: {
      sizes: {
        ...icongraphyDefaults.sizes,
        ...config.icongraphy?.sizes,
      },
      strokeWidth: config.icongraphy?.strokeWidth ?? icongraphyDefaults.strokeWidth,
    },
    size: {
      ...defaultSizeTokens(),
      ...config.size,
    },
    spacing: {
      ...defaultSpacingTokens(),
      ...config.spacing,
    },
    padding: {
      ...defaultPaddingTokens(),
      ...config.padding,
    },
    borderRadius: {
      ...defaultBorderRadiusTokens(),
      ...config.borderRadius,
    },
    borderWidth: {
      ...defaultBorderWidthTokens(),
      ...config.borderWidth,
    },
    elevation: {
      ...elevationDefaults,
      ...Object.fromEntries(
        Object.entries(config.elevation ?? {}).map(([level, layout]) => [
          level,
          layout
            ? withShadowColor(layout, elevationDefaults[level as keyof ThemeElevationTokens].color)
            : elevationDefaults[level as keyof ThemeElevationTokens],
        ])
      ) as ThemeElevationTokens,
    },
    motion: {
      durations: {
        ...defaultMotionTokens().durations,
        ...config.motion?.durations,
      },
    },
    focusOutline: {
      width: config.focusOutline?.width ?? focusOutlineDefaults.width,
      offset: config.focusOutline?.offset ?? focusOutlineDefaults.offset,
      style: config.focusOutline?.style ?? focusOutlineDefaults.style,
      color: config.focusOutline?.color ?? focusOutlineDefaults.color,
    },
    config: {
      coloring: {
        tonal: {
          color: config.config?.coloring?.tonal?.color ?? coloringDefaults.tonal.color,
          onColor: config.config?.coloring?.tonal?.onColor ?? coloringDefaults.tonal.onColor,
        },
        transparent: {
          color: config.config?.coloring?.tonal?.color ?? coloringDefaults.transparent.color,
          onColor: config.config?.coloring?.tonal?.onColor ?? coloringDefaults.transparent.onColor,
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
