import { colorPalettes } from '../color-palettes'
import { createColoringTokensDefinitions } from '../../helpers/style-resolvers/coloring'
import type { DesignTokens, SemanticColorTokens } from '../../types'
import type { ComponentColorTokens } from '@/src/types/component-colors'
import { animationTokens } from '../animation'
import { componentLayouts } from '../layout'
import { decorationTokens } from '../decoration'
import { typography } from '../typography/typography'

const { gray, green, orange, red, purple, blue, white, black } = colorPalettes

const semantic = {
  background: gray.value[75],
  onBackground: gray.value[900],
  warning: orange.value[500],
  onWarning: white.value,
  warningHover: orange.value[600],
  positive: green.value[500],
  onPositive: white.value,
  positiveHover: green.value[600],
  negative: red.value[500],
  onNegative: white.value,
  negativeHover: red.value[600],
  disabled: gray.value[300],
  onDisabled: gray.value[500],
  surface: gray.value[25],
  onSurface: gray.value[900],
  surfaceHover: white.value,
  surfaceVariant: white.value,
  onSurfaceVariant: gray.value[900],
  surfaceWarning: orange.value[100],
  onSurfaceWarning: orange.value[500],
  textPrimary: gray.value[900],
  textSecondary: gray.value[600],
  textTertiary: gray.value[300],
  placeholder: gray.value[500],
  description: gray.value[600],
  label: gray.value[700],
  primary: purple.value[500],
  onPrimary: white.value,
  primaryHover: purple.value[600],
  secondary: blue.value[500],
  onSecondary: white.value,
  secondaryHover: blue.value[600],
  neutral: gray.value[150],
  onNeutral: black.value,
  neutralHover: gray.value[200],
  neutralText: black.value,
  neutralTextHover: gray.value[500],
  neutralOutline: black.value,
  neutralOutlineHover: gray.value[600],
  neutralTonalText: black.value,
  neutralTonalBackground: gray.value[300],
  faded: gray.value[250],
  highlight: blue.value[500],
} as const satisfies SemanticColorTokens

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
    border: gray.value[200],
  },
  overlay: {
    background: semantic.surface,
    text: semantic.onSurface,
    shadow: '#00000038',
  },
  progressIndicator: {
    fill: semantic.primary,
    background: gray.value[300],
  },
  processModel: {
    edge: {
      stroke: semantic.primary,
      label: {
        background: gray.value[100],
        textStrong: semantic.primary,
        textMuted: purple.value[300],
      },
    },
    terminal: {
      fill: semantic.primary,
      fillActive: semantic.primaryHover,
      fillVisited: purple.value[400],
    },
    activityIcon: {
      background: purple.value[100],
    },
    node: {
      activeRing: purple.value[100],
      activeBackground: purple.value[50],
      visitedBorder: purple.value[200],
      visitedBackground: '#fdf9ff',
    },
  },
  propertyTitle: {
    background: gray.value[100],
    text: semantic.description,
  },
  scrollbar: {
    track: '#00000033',
    thumb: gray.value[600],
  },
  stepperBarDot: {
    active: semantic.primary,
    normal: purple.value[100],
    disabled: semantic.description,
  },
  switchThumb: {
    inactive: semantic.onSurface,
    active: white.value,
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
      text: white.value,
    },
    secondary: {
      background: blue.value[500],
      text: white.value,
    },
    dark: {
      background: blue.value[900],
      text: white.value,
    },
  },
  tooltip: {
    background: semantic.surfaceVariant,
    text: semantic.description,
  },
  border: gray.value[200],
  divider: gray.value[100],
  focus: semantic.primary,
  outline: gray.value[100],
  outlineVariant: gray.value[200],
} as const satisfies ComponentColorTokens

export const lightTheme = {
  colors: colorPalettes,
  semanticColors: semantic,
  coloring: createColoringTokensDefinitions(semantic),
  componentColors: component,
  typography: typography,
  animation: animationTokens,
  layout: componentLayouts,
  decorcation: decorationTokens,
} as const satisfies DesignTokens
