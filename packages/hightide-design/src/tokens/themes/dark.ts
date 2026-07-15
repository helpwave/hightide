import { colorPalettes } from '../palettes'
import type { ComponentColors, DesignTheme, SemanticColors } from '../../types'

const { gray, green, orange, red, purple, blue, white } = colorPalettes

const semantic = {
  background: gray[850],
  onBackground: gray[100],
  warning: orange[500],
  onWarning: white,
  warningHover: orange[600],
  positive: green[700],
  onPositive: white,
  positiveHover: green[600],
  negative: red[500],
  onNegative: white,
  negativeHover: red[600],
  disabled: gray[500],
  onDisabled: gray[300],
  surface: gray[800],
  onSurface: gray[100],
  surfaceHover: gray[700],
  surfaceVariant: gray[900],
  onSurfaceVariant: gray[100],
  surfaceWarning: orange[900],
  onSurfaceWarning: orange[500],
  textPrimary: gray[100],
  textSecondary: gray[400],
  textTertiary: gray[600],
  placeholder: gray[500],
  description: gray[400],
  label: gray[300],
  primary: purple[400],
  onPrimary: white,
  primaryHover: purple[500],
  secondary: blue[500],
  onSecondary: white,
  secondaryHover: blue[600],
  neutral: gray[750],
  onNeutral: white,
  neutralHover: gray[600],
  neutralText: white,
  neutralTextHover: gray[500],
  neutralOutline: gray[200],
  neutralOutlineHover: gray[400],
  neutralTonalText: white,
  neutralTonalBackground: gray[400],
  faded: gray[650],
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
    border: gray[600],
  },
  overlay: {
    background: semantic.surface,
    text: semantic.onSurface,
    shadow: 'rgba(0, 0, 0, 0.38)',
  },
  progressIndicator: {
    fill: semantic.primary,
    background: gray[700],
  },
  processModel: {
    edge: {
      stroke: semantic.primary,
      label: {
        background: gray[700],
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
      activeBackground: gray[700],
      visitedBorder: purple[200],
      visitedBackground: gray[750],
    },
  },
  propertyTitle: {
    background: gray[750],
    text: semantic.description,
  },
  scrollbar: {
    track: 'rgba(255, 255, 255, 0.2)',
    thumb: gray[300],
  },
  stepperBarDot: {
    active: semantic.primary,
    normal: purple[100],
    disabled: semantic.description,
  },
  switchThumb: {
    inactive: semantic.onSurface,
    active: semantic.onSurface,
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
  border: gray[600],
  divider: gray[700],
  focus: semantic.primary,
  outline: gray[700],
  outlineVariant: gray[600],
} as const satisfies ComponentColors

export const darkTheme = {
  palettes: colorPalettes,
  semantic,
  component,
} as const satisfies DesignTheme
