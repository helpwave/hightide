import { colorPalettes } from '../color-palettes'
import { createColoringTokensDefinitions } from '../../helpers/style-resolvers/coloring'
import type { HightideDesignTokens, HightideSemanticColorTokens } from '../../types'
import type { ComponentColorTokens } from '@/src/types/component-colors'
import { animationTokens } from '../animation'
import { componentLayouts } from '../layout'
import { typography } from '../typography/typography'
import { decorationTokens } from '../decoration'

const { gray, green, orange, red, purple, blue, white } = colorPalettes

const semantic = {
  background: gray.value[850],
  onBackground: gray.value[100],
  warning: orange.value[500],
  onWarning: white.value,
  warningHover: orange.value[600],
  positive: green.value[700],
  onPositive: white.value,
  positiveHover: green.value[600],
  negative: red.value[500],
  onNegative: white.value,
  negativeHover: red.value[600],
  disabled: gray.value[500],
  onDisabled: gray.value[300],
  surface: gray.value[800],
  onSurface: gray.value[100],
  surfaceHover: gray.value[700],
  surfaceVariant: gray.value[900],
  onSurfaceVariant: gray.value[100],
  surfaceWarning: orange.value[900],
  onSurfaceWarning: orange.value[500],
  textPrimary: gray.value[100],
  textSecondary: gray.value[400],
  textTertiary: gray.value[600],
  placeholder: gray.value[500],
  description: gray.value[400],
  label: gray.value[300],
  primary: purple.value[400],
  onPrimary: white.value,
  primaryHover: purple.value[500],
  secondary: blue.value[500],
  onSecondary: white.value,
  secondaryHover: blue.value[600],
  neutral: gray.value[750],
  onNeutral: white.value,
  neutralHover: gray.value[600],
  neutralText: white.value,
  neutralTextHover: gray.value[500],
  neutralOutline: gray.value[200],
  neutralOutlineHover: gray.value[400],
  neutralTonalText: white.value,
  neutralTonalBackground: gray.value[400],
  faded: gray.value[650],
  highlight: blue.value[500],
} as const satisfies HightideSemanticColorTokens

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
    border: gray.value[600],
  },
  overlay: {
    background: semantic.surface,
    text: semantic.onSurface,
    shadow: '#00000061',
  },
  progressIndicator: {
    fill: semantic.primary,
    background: gray.value[700],
  },
  processModel: {
    edge: {
      stroke: semantic.primary,
      label: {
        background: gray.value[700],
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
      activeBackground: gray.value[700],
      visitedBorder: purple.value[200],
      visitedBackground: gray.value[750],
    },
  },
  propertyTitle: {
    background: gray.value[750],
    text: semantic.description,
  },
  scrollbar: {
    track: '#FFFFFF33',
    thumb: gray.value[300],
  },
  stepperBarDot: {
    active: semantic.primary,
    normal: purple.value[100],
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
  border: gray.value[600],
  divider: gray.value[700],
  focus: semantic.primary,
  outline: gray.value[700],
  outlineVariant: gray.value[600],
} as const satisfies ComponentColorTokens

export const darkTheme = {
  colors: colorPalettes,
  semanticColors: semantic,
  coloring: createColoringTokensDefinitions(semantic),
  componentColors: component,
  typography,
  animation: animationTokens,
  layout: componentLayouts,
  decorcation: decorationTokens,
} as const satisfies HightideDesignTokens
