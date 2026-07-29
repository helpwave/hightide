import type { SemanticTokens } from '../semantic/to-semantic'
import type { ComponentColorTokens } from './component-colors'
import {
  toHightideComponentLayouts,
  type ComponentLayoutTokens
} from './component-layouts'

export type ComponentTokens = {
  colors: ComponentColorTokens,
  layout: ComponentLayoutTokens,
}

export type ToComponentsArgs<Tokens extends SemanticTokens = SemanticTokens> = {
  semanticTokens: Tokens,
}

export const toHightideComponentColors = (
  semantic: SemanticTokens
): ComponentColorTokens => {
  const colors = semantic.colors

  return {
    carouselDot: {
      active: colors.primary,
      disabled: colors.disabled,
    },
    input: {
      background: colors.surfaceVariant,
      text: colors.onSurface,
    },
    menu: {
      background: colors.surfaceVariant,
      text: colors.onSurface,
      border: colors.menuBorder,
    },
    overlay: {
      background: colors.surface,
      text: colors.onSurface,
      shadow: colors.overlayShadow,
    },
    progressIndicator: {
      fill: colors.primary,
      background: colors.progressTrack,
    },
    processModel: {
      edge: {
        stroke: colors.primary,
        label: {
          background: colors.processModelLabelBackground,
          textStrong: colors.primary,
          textMuted: colors.processModelLabelMuted,
        },
      },
      terminal: {
        fill: colors.primary,
        fillActive: colors.primaryHover,
        fillVisited: colors.processModelTerminalVisited,
      },
      activityIcon: {
        background: colors.processModelActivityIcon,
      },
      node: {
        activeRing: colors.processModelActiveRing,
        activeBackground: colors.processModelActiveBackground,
        visitedBorder: colors.processModelVisitedBorder,
        visitedBackground: colors.processModelVisitedBackground,
      },
    },
    propertyTitle: {
      background: colors.propertyTitleBackground,
      text: colors.description,
    },
    scrollbar: {
      track: colors.scrollbarTrack,
      thumb: colors.scrollbarThumb,
    },
    stepperBarDot: {
      active: colors.primary,
      normal: colors.stepperNormal,
      disabled: colors.description,
    },
    switch: {
      track: {
        inactive: colors.surfaceVariant,
        active: colors.primary,
      },
      thumb: {
        inactive: colors.switchThumbInactive,
        active: colors.switchThumbActive,
      },
      borderColor: colors.switchBorder,
    },
    table: {
      background: colors.surface,
      text: colors.onSurface,
      headerBackground: colors.surfaceVariant,
      rowHoverBackground: colors.surfaceHover,
    },
    textImage: {
      primary: {
        background: colors.primary,
        text: colors.textImageOnColor,
      },
      secondary: {
        background: colors.textImageSecondary,
        text: colors.textImageOnColor,
      },
      dark: {
        background: colors.textImageDark,
        text: colors.textImageOnColor,
      },
    },
    tooltip: {
      background: colors.surfaceVariant,
      text: colors.description,
    },
    border: colors.border,
    divider: colors.divider,
    focus: colors.primary,
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
  }
}

export const toHightideComponentTokens = ({
  semanticTokens,
}: ToComponentsArgs): ComponentTokens => ({
  colors: toHightideComponentColors(semanticTokens),
  layout: toHightideComponentLayouts(semanticTokens),
})
