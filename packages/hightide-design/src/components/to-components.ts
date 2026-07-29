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
    input: {
      background: colors.surfaceVariant,
      text: colors.onSurface,
    },
    menu: {
      background: colors.surfaceVariant,
      text: colors.onSurface,
      border: colors.menuBorder,
    },
    progressIndicator: {
      fill: colors.primary,
      background: colors.progressTrack,
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
    border: colors.border,
    divider: colors.divider,
    focus: colors.primary,
  }
}

export const toHightideComponentTokens = ({
  semanticTokens,
}: ToComponentsArgs): ComponentTokens => ({
  colors: toHightideComponentColors(semanticTokens),
  layout: toHightideComponentLayouts(semanticTokens),
})
