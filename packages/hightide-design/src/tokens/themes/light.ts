import { colorPalettes } from '../palettes'
import type { ComponentColors, DesignTheme, SemanticColors } from '../../types'

const { gray, green, orange, red, purple, blue, white, black } = colorPalettes

const semantic = {
  background: gray[75],
  onBackground: gray[900],
  warning: orange[500],
  onWarning: white,
  warningHover: orange[600],
  positive: green[500],
  onPositive: white,
  positiveHover: green[600],
  negative: red[500],
  onNegative: white,
  negativeHover: red[600],
  disabled: gray[300],
  onDisabled: gray[500],
  surface: gray[25],
  onSurface: gray[900],
  surfaceHover: white,
  surfaceVariant: white,
  onSurfaceVariant: gray[900],
  surfaceWarning: orange[100],
  onSurfaceWarning: orange[500],
  textPrimary: gray[900],
  textSecondary: gray[600],
  textTertiary: gray[300],
  placeholder: gray[500],
  description: gray[600],
  label: gray[700],
  primary: purple[500],
  onPrimary: white,
  primaryHover: purple[600],
  secondary: blue[500],
  onSecondary: white,
  secondaryHover: blue[600],
  neutral: gray[150],
  onNeutral: black,
  neutralHover: gray[200],
  neutralText: black,
  neutralTextHover: gray[500],
  neutralOutline: black,
  neutralOutlineHover: gray[600],
  neutralTonalText: black,
  neutralTonalBackground: gray[300],
  faded: gray[250],
  highlight: blue[500],
} as const satisfies SemanticColors

const component = {
  carouselDot: {
    active: semantic.primary,
    disabled: semantic.disabled,
  },
  input: {
    background: semantic.surfaceVariant,
    text: semantic.onSurface,
  },
  menu: {
    background: semantic.surfaceVariant,
    text: semantic.onSurface,
    border: gray[200],
  },
  overlay: {
    background: semantic.surface,
    text: semantic.onSurface,
    shadow: 'rgba(0, 0, 0, 0.22)',
  },
  progressIndicator: {
    fill: semantic.primary,
    background: gray[300],
  },
  processModel: {
    edge: {
      stroke: semantic.primary,
      label: {
        background: gray[100],
        textStrong: semantic.primary,
        textMuted: purple[300],
      },
    },
    terminal: {
      fill: semantic.primary,
      fillActive: semantic.primaryHover,
      fillVisited: purple[400],
    },
    activityIcon: {
      background: purple[100],
    },
    node: {
      activeRing: purple[100],
      activeBackground: purple[50],
      visitedBorder: purple[200],
      visitedBackground: '#fdf9ff',
    },
  },
  propertyTitle: {
    background: gray[100],
    text: semantic.description,
  },
  scrollbar: {
    track: 'rgba(0, 0, 0, 0.2)',
    thumb: gray[600],
  },
  stepperBarDot: {
    active: semantic.primary,
    normal: purple[100],
    disabled: semantic.description,
  },
  switchThumb: {
    inactive: semantic.onSurface,
    active: white,
  },
  table: {
    background: semantic.surface,
    text: semantic.onSurface,
    headerBackground: semantic.surfaceVariant,
    rowHoverBackground: semantic.surfaceHover,
  },
  textImage: {
    primary: {
      background: semantic.primary,
      text: white,
    },
    secondary: {
      background: blue[500],
      text: white,
    },
    dark: {
      background: blue[900],
      text: white,
    },
  },
  tooltip: {
    background: semantic.surfaceVariant,
    text: semantic.description,
  },
  border: gray[200],
  divider: gray[100],
  focus: semantic.primary,
  outline: gray[100],
  outlineVariant: gray[200],
} as const satisfies ComponentColors

export const lightTheme = {
  palettes: colorPalettes,
  semantic,
  component,
} as const satisfies DesignTheme
