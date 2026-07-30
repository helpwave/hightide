import { StyleSheet } from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { HightideColorSchemes, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic-tokens'

import type {
  CardActionItemState,
  CardTheme
} from '../types/components/card'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateCardThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
}

export const createCardTheme = ({
  colors,
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
      borderBottomColor: colors.divider,
      backgroundColor: pressed ? colors.surfaceHover : colors.transparent,
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
      : colors.onSurface,
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
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    })),
    item: createStyleResolver(() => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      gap: 12,
    })),
    itemContent: createStyleResolver(resolveItemContent),
    itemLabel: createStyleResolver(() => ({
      color: colors.description,
      fontSize: 12,
    })),
    itemValue: createStyleResolver(() => ({
      color: colors.onSurface,
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
      color: colors.description,
    })),
  }
}

export const createCardThemeFromDesign = (theme: DesignTokensTheme): CardTheme => {
  return createCardTheme({
    colors: theme.colors,
    colorSchemes: theme.colorSchemes,
  })
}
