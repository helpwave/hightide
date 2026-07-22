import type { ColorToken } from './color'

export type ComponentColorTokens = {
  carouselDot: {
    active: ColorToken,
    disabled: ColorToken,
  },
  input: {
    background: ColorToken,
    text: ColorToken,
  },
  menu: {
    background: ColorToken,
    text: ColorToken,
    border: ColorToken,
  },
  overlay: {
    background: ColorToken,
    text: ColorToken,
    shadow: ColorToken,
  },
  progressIndicator: {
    fill: ColorToken,
    background: ColorToken,
  },
  processModel: {
    edge: {
      stroke: ColorToken,
      label: {
        background: ColorToken,
        textStrong: ColorToken,
        textMuted: ColorToken,
      },
    },
    terminal: {
      fill: ColorToken,
      fillActive: ColorToken,
      fillVisited: ColorToken,
    },
    activityIcon: {
      background: ColorToken,
    },
    node: {
      activeRing: ColorToken,
      activeBackground: ColorToken,
      visitedBorder: ColorToken,
      visitedBackground: ColorToken,
    },
  },
  propertyTitle: {
    background: ColorToken,
    text: ColorToken,
  },
  scrollbar: {
    track: ColorToken,
    thumb: ColorToken,
  },
  stepperBarDot: {
    active: ColorToken,
    normal: ColorToken,
    disabled: ColorToken,
  },
  switchThumb: {
    inactive: ColorToken,
    active: ColorToken,
  },
  table: {
    background: ColorToken,
    text: ColorToken,
    headerBackground: ColorToken,
    rowHoverBackground: ColorToken,
  },
  textImage: {
    primary: {
      background: ColorToken,
      text: ColorToken,
    },
    secondary: {
      background: ColorToken,
      text: ColorToken,
    },
    dark: {
      background: ColorToken,
      text: ColorToken,
    },
  },
  tooltip: {
    background: ColorToken,
    text: ColorToken,
  },
  border: ColorToken,
  divider: ColorToken,
  focus: ColorToken,
  outline: ColorToken,
  outlineVariant: ColorToken,
}