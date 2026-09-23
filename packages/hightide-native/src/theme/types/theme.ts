import type { HexColor } from './color'
import type { ColorPair } from './color'
import type { HightideComponentThemes } from './components/hightide'
import type { HightideIcongraphy } from './icongraphy'
import type {
  HightideBorderRadius,
  HightideBorderWidth,
  HightideElevation,
  HightideMotion,
  HightidePadding,
  HightideShadow,
  HightideSize,
  HightideSpacing
} from './layout'
import type { HightideThemeSemantics } from './semantics'
import type {
  HightideFontFamilies,
  HightideFontSizing,
  HightideFontWeights,
  HightideTypography
} from './typography'

export type ThemeColors = {
  tintConfig: {
    light: number,
    normal: number,
    strong: number,
  },
  background: ColorPair,
  surface: ColorPair,
  surfaceVariant: ColorPair,
  surfaceInverse: ColorPair,
  disabled: ColorPair,
  primary: ColorPair,
  secondary: ColorPair,
  tertiary: ColorPair,
  positive: ColorPair,
  warning: ColorPair,
  negative: ColorPair,
  neutral: ColorPair,
  border: HexColor,
  overlay: HexColor,
}

export type ThemeConfig = {
  coloring: {
    tonal: {
      color: number,
      onColor: number,
    },
    transparent: {
      color: number,
      onColor: number,
    },
  },
  appearancePercentages: {
    normal: number,
    subtle: number,
    faded: number,
  },
}

export type FocusOutline = {
  width?: number,
  offset?: number,
  color?: HexColor,
  style?: string,
}

export type Theme = {
  colors: Record<string, unknown>,
  fontFamilies: Record<string, unknown>,
  fontWeights: Record<string, unknown>,
  fontSizing: Record<string, unknown>,
  typography: Record<string, unknown>,
  icongraphy: Record<string, unknown>,
  size: Record<string, unknown>,
  spacing: Record<string, unknown>,
  padding: Record<string, unknown>,
  borderRadius: Record<string, unknown>,
  borderWidth: Record<string, unknown>,
  elevation: Record<string, unknown>,
  shadow: Record<string, unknown>,
  motion: Record<string, unknown>,
  focusOutline: Record<string, unknown>,
  config: Record<string, unknown>,
  semantics: Record<string, unknown>,
  components: Record<string, unknown>,
}

export type HightideTheme = Theme & {
  colors: ThemeColors,
  fontFamilies: HightideFontFamilies,
  fontWeights: HightideFontWeights,
  fontSizing: HightideFontSizing,
  typography: HightideTypography,
  icongraphy: HightideIcongraphy,
  size: HightideSize,
  spacing: HightideSpacing,
  padding: HightidePadding,
  borderRadius: HightideBorderRadius,
  borderWidth: HightideBorderWidth,
  elevation: HightideElevation,
  shadow: HightideShadow,
  motion: HightideMotion,
  focusOutline: FocusOutline,
  config: ThemeConfig,
  semantics: HightideThemeSemantics,
  components: HightideComponentThemes,
}
