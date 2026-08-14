import type { ColorToken, HexColorToken } from '../primitive-tokens/color'
import { hightideTypography } from '../primitive-tokens/typography'
import type { ShadowLayoutToken } from '../primitive-tokens/shadow'
import { hightideShadow } from '../primitive-tokens/shadow'
import { HexColorUtils } from '../utils/hex'
import { OKLCHUtils } from '../utils/oklch'
import type {
  ColorPairToken,
  ThemeTokensModeConfig,
  TintConfig
} from './theme-tokens-config'
import type {
  OutlineToken,
  ThemeAppearancePercentages,
  ThemeBorderWidthTokens,
  ThemeColorTokens,
  ThemeElevationTokens,
  ThemeIcongraphyTokens,
  ThemeMotionTokens,
  ThemeShapeTokens,
  ThemeSizeTokens,
  ThemeSpacingTokens,
  ThemeTokens,
  ThemeTypographyTokens
} from './theme-tokens'
import type { TypographyStyleToken } from './typography-style-token'

export const defaultTintConfig: TintConfig = {
  light: 0.08,
  normal: 0.16,
  strong: 0.20,
}

export const tertiaryLightColor = '#057986' as const satisfies HexColorToken
export const tertiaryDarkColor = HexColorUtils.mixWithWhite(tertiaryLightColor, 0.35)

const createTypographyStyle = (
  fontSize: number,
  lineHeight: number,
  fontWeight: TypographyStyleToken['fontWeight'],
  fontFamily: string
): TypographyStyleToken => ({
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
})

export const defaultTypographyTokens = (): ThemeTypographyTokens => {
  const { fontFamily, fontSize, fontWeight, lineHeight } = hightideTypography
  const defaultFamily = fontFamily.inter
  const accentFamily = fontFamily.spaceGrotesk

  return {
    fontFamilies: {
      default: defaultFamily,
      accent: accentFamily,
      mono: defaultFamily,
    },
    fontWeights: {
      thin: fontWeight.thin,
      light: fontWeight.light,
      base: fontWeight.base,
      medium: fontWeight.medium,
      semibold: fontWeight.semibold,
      bold: fontWeight.bold,
    },
    display: createTypographyStyle(fontSize['4xl'], lineHeight['4xl'], fontWeight.bold, accentFamily),
    heading: {
      lg: createTypographyStyle(fontSize['2xl'], lineHeight['2xl'], fontWeight.semibold, accentFamily),
      md: createTypographyStyle(fontSize.lg, lineHeight.lg, fontWeight.semibold, accentFamily),
      sm: createTypographyStyle(fontSize.base, lineHeight.base, fontWeight.medium, accentFamily),
    },
    body: {
      lg: createTypographyStyle(fontSize.lg, lineHeight.lg, fontWeight.base, defaultFamily),
      md: createTypographyStyle(fontSize.base, lineHeight.base, fontWeight.base, defaultFamily),
      sm: createTypographyStyle(fontSize.sm, lineHeight.sm, fontWeight.base, defaultFamily),
    },
    label: {
      lg: createTypographyStyle(fontSize.lg, lineHeight.lg, fontWeight.semibold, defaultFamily),
      md: createTypographyStyle(fontSize.base, lineHeight.base, fontWeight.semibold, defaultFamily),
      sm: createTypographyStyle(fontSize.sm, lineHeight.sm, fontWeight.medium, defaultFamily),
    },
  }
}

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
    lg: 36,
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

export const defaultShapeTokens = (): ThemeShapeTokens => ({
  borderRadius: {
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    xxl: 18,
  },
  padding: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 10,
    xl: 14,
  },
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
    level1: withShadowColor(sizes.xs, '#0000000F'), // 6%
    level2: withShadowColor(sizes.sm, '#0000001A'), // 10%
    level3: withShadowColor(sizes.md, '#00000024'), // 14%
    level4: withShadowColor(sizes.lg, '#0000002E'), // 18%
    level5: withShadowColor(sizes.xl, '#00000038'), // 22%
  }
}

export const defaultDarkElevationTokens = (): ThemeElevationTokens => {
  const sizes = hightideShadow.layout.bottom

  return {
    level1: withShadowColor(sizes.xs, '#FFFFFF0A'), // 4%
    level2: withShadowColor(sizes.sm, '#FFFFFF0F'), // 6%
    level3: withShadowColor(sizes.md, '#FFFFFF14'), // 8%
    level4: withShadowColor(sizes.lg, '#FFFFFF1A'), // 10%
    level5: withShadowColor(sizes.xl, '#FFFFFF24'), // 14%
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
    fontFamilies: {
      ...defaults.fontFamilies,
      ...override.fontFamilies,
    },
    fontWeights: {
      ...defaults.fontWeights,
      ...override.fontWeights,
    },
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
  disabled: params.disabled,
  primary: params.primary,
  secondary: params.secondary,
  tertiary: params.tertiary,
  positive: params.positive,
  warning: params.warning,
  negative: params.negative,
  neutral: params.neutral,
  border: OKLCHUtils.changeLightness(params.surface.onColor, 0.8),
})

export const resolveSharedGroups = (
  config: ThemeTokensModeConfig,
  elevationDefaults: ThemeElevationTokens
): Pick<ThemeTokens, 'decoration' | 'typography' | 'icongraphy' | 'size' | 'spacing' | 'shape' | 'borderWidth' | 'elevation' | 'motion' | 'focusOutline'> => {
  const appearanceDefaults = defaultAppearancePercentages()
  const focusOutlineDefaults = defaultFocusOutlineToken()
  const icongraphyDefaults = defaultIcongraphyTokens()

  return {
    decoration: {
      appearancePercentages: {
        normal: config.decoration?.appearancePercentages?.normal ?? appearanceDefaults.normal,
        subtle: config.decoration?.appearancePercentages?.subtle ?? appearanceDefaults.subtle,
        faded: config.decoration?.appearancePercentages?.faded ?? appearanceDefaults.faded,
      },
    },
    typography: mergeTypography(defaultTypographyTokens(), config.typography),
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
    shape: {
      borderRadius: {
        ...defaultShapeTokens().borderRadius,
        ...config.shape?.borderRadius,
      },
      padding: {
        ...defaultShapeTokens().padding,
        ...config.shape?.padding,
      },
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
  }
}
