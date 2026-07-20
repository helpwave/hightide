import type { ColorValue, DesignColorPalettes } from './color'
import type { ColoringTokensDefinitions } from './coloring'

export type ThemeMode = 'light' | 'dark'

export type SemanticColors = {
  background: ColorValue,
  onBackground: ColorValue,
  warning: ColorValue,
  onWarning: ColorValue,
  warningHover: ColorValue,
  positive: ColorValue,
  onPositive: ColorValue,
  positiveHover: ColorValue,
  negative: ColorValue,
  onNegative: ColorValue,
  negativeHover: ColorValue,
  disabled: ColorValue,
  onDisabled: ColorValue,
  surface: ColorValue,
  onSurface: ColorValue,
  surfaceHover: ColorValue,
  surfaceVariant: ColorValue,
  onSurfaceVariant: ColorValue,
  surfaceWarning: ColorValue,
  onSurfaceWarning: ColorValue,
  textPrimary: ColorValue,
  textSecondary: ColorValue,
  textTertiary: ColorValue,
  placeholder: ColorValue,
  description: ColorValue,
  label: ColorValue,
  primary: ColorValue,
  onPrimary: ColorValue,
  primaryHover: ColorValue,
  secondary: ColorValue,
  onSecondary: ColorValue,
  secondaryHover: ColorValue,
  neutral: ColorValue,
  onNeutral: ColorValue,
  neutralHover: ColorValue,
  neutralText: ColorValue,
  neutralTextHover: ColorValue,
  neutralOutline: ColorValue,
  neutralOutlineHover: ColorValue,
  neutralTonalText: ColorValue,
  neutralTonalBackground: ColorValue,
  faded: ColorValue,
  highlight: ColorValue,
}

export type ComponentColors = {
  carouselDot: {
    active: ColorValue,
    disabled: ColorValue,
  },
  input: {
    background: ColorValue,
    text: ColorValue,
  },
  menu: {
    background: ColorValue,
    text: ColorValue,
    border: ColorValue,
  },
  overlay: {
    background: ColorValue,
    text: ColorValue,
    shadow: ColorValue,
  },
  progressIndicator: {
    fill: ColorValue,
    background: ColorValue,
  },
  processModel: {
    edge: {
      stroke: ColorValue,
      label: {
        background: ColorValue,
        textStrong: ColorValue,
        textMuted: ColorValue,
      },
    },
    terminal: {
      fill: ColorValue,
      fillActive: ColorValue,
      fillVisited: ColorValue,
    },
    activityIcon: {
      background: ColorValue,
    },
    node: {
      activeRing: ColorValue,
      activeBackground: ColorValue,
      visitedBorder: ColorValue,
      visitedBackground: ColorValue,
    },
  },
  propertyTitle: {
    background: ColorValue,
    text: ColorValue,
  },
  scrollbar: {
    track: ColorValue,
    thumb: ColorValue,
  },
  stepperBarDot: {
    active: ColorValue,
    normal: ColorValue,
    disabled: ColorValue,
  },
  switchThumb: {
    inactive: ColorValue,
    active: ColorValue,
  },
  table: {
    background: ColorValue,
    text: ColorValue,
    headerBackground: ColorValue,
    rowHoverBackground: ColorValue,
  },
  textImage: {
    primary: {
      background: ColorValue,
      text: ColorValue,
    },
    secondary: {
      background: ColorValue,
      text: ColorValue,
    },
    dark: {
      background: ColorValue,
      text: ColorValue,
    },
  },
  tooltip: {
    background: ColorValue,
    text: ColorValue,
  },
  border: ColorValue,
  divider: ColorValue,
  focus: ColorValue,
  outline: ColorValue,
  outlineVariant: ColorValue,
}

export type DesignTheme = {
  palettes: DesignColorPalettes,
  semantic: SemanticColors,
  coloring: ColoringTokensDefinitions,
  component: ComponentColors,
}

export type DesignThemes = Record<ThemeMode, DesignTheme>
