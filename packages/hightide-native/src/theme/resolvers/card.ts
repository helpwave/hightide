import { StyleSheet } from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type {
  CardActionItemState,
  CardTheme
} from '../types/components/card'
import type { HightideComponentThemes } from '../types/components/hightide'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateCardThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: HightideComponentThemes['colorSchemes'],
}

export const createCardTheme = ({
  semantic,
  colorSchemes,
}: CreateCardThemeOptions): CardTheme => {
  const resolveActionItem = (state: CardActionItemState) => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: semantic.divider,
      backgroundColor: pressed ? semantic.surfaceHover : semantic.transparent,
      opacity: state.isDisabled ? 0.6 : 1,
    }
  }

  const resolveItemContent = () => ({
    flex: 1,
    gap: 4,
    justifyContent: 'center' as const,
  })

  const resolveActionLabel = (state: CardActionItemState) => ({
    color: state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : semantic.onSurface,
    fontSize: 15,
    fontWeight: hightideTypography.fontWeight.medium,
  })

  const resolveActionIcon = (state: CardActionItemState) => ({
    color: state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : colorSchemes.primary.text.base.foreground,
  })

  return {
    card: createStyleResolver(() => ({
      backgroundColor: semantic.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: semantic.border,
      overflow: 'hidden',
    })),
    item: createStyleResolver(() => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: semantic.divider,
      gap: 12,
    })),
    itemContent: createStyleResolver(resolveItemContent),
    itemLabel: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: 12,
    })),
    itemValue: createStyleResolver(() => ({
      color: semantic.onSurface,
      fontSize: 15,
      fontWeight: hightideTypography.fontWeight.medium,
    })),
    actionItem: createStyleResolver(resolveActionItem),
    actionItemContent: createStyleResolver(resolveItemContent),
    actionItemLabel: createStyleResolver(resolveActionLabel),
    actionItemIcon: createValueResolver(resolveActionIcon),
    navigationItem: createStyleResolver(resolveActionItem),
    navigationItemContent: createStyleResolver(resolveItemContent),
    navigationItemLabel: createStyleResolver(resolveActionLabel),
    navigationItemIcon: createValueResolver(resolveActionIcon),
    navigationItemTrailing: createValueResolver(() => ({
      color: semantic.description,
    })),
  }
}

export const createCardThemeFromDesign = (theme: DesignTokensTheme): CardTheme => {
  return createCardTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
  })
}
