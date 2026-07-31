import type { TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'
import type {
  HightideSematicColorSchemeTokens,
  HightideSemanticColorTokens
} from '@helpwave/hightide-design/semantic-tokens'

import type {
  CardActionItemContentStyle,
  CardActionItemIconColor,
  CardActionItemLabelStyle,
  CardActionItemState,
  CardActionItemStyle,
  CardItemContentStyle,
  CardItemLabelStyle,
  CardItemStyle,
  CardItemValueStyle,
  CardStyle,
  CardTheme
} from '../types/components/card'
import type { Color } from '../types/color'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateCardThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideSematicColorSchemeTokens,
  card: HightideComponentTokens['card'],
}

export const createCardTheme = ({
  colors,
  colorSchemes,
  card,
}: CreateCardThemeOptions): CardTheme => {
  const resolveActionItem = (state: CardActionItemState): CardActionItemStyle => {
    const pressed = !!state.isPressed && !state.isDisabled

    return {
      flexDirection: 'row',
      alignItems: 'center',
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

  const resolveItemContent = (): CardItemContentStyle => ({
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  })

  const resolveActionLabel = (state: CardActionItemState): CardActionItemLabelStyle => ({
    color: state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : card.text,
    fontSize: 15,
    fontWeight: hightideTypography.fontWeight.medium as TextStyle['fontWeight'],
  })

  const resolveActionIcon = (state: CardActionItemState): CardActionItemIconColor => ({
    color: (state.isDanger
      ? colorSchemes.negative.text.base.foreground
      : colorSchemes.primary.text.base.foreground) as Color,
  })

  return {
    card: createStyleResolver((): CardStyle => ({
      backgroundColor: card.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: card.border,
      overflow: 'hidden',
    })),
    item: createStyleResolver((): CardItemStyle => ({
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      gap: 12,
    })),
    itemContent: createStyleResolver(resolveItemContent),
    itemLabel: createStyleResolver((): CardItemLabelStyle => ({
      color: colors.description,
      fontSize: 12,
    })),
    itemValue: createStyleResolver((): CardItemValueStyle => ({
      color: card.text,
      fontSize: 15,
      fontWeight: hightideTypography.fontWeight.medium as TextStyle['fontWeight'],
    })),
    actionItem: createStyleResolver(resolveActionItem),
    actionItemContent: createStyleResolver((): CardActionItemContentStyle => resolveItemContent()),
    actionItemLabel: createStyleResolver(resolveActionLabel),
    actionItemIcon: createValueResolver(resolveActionIcon),
    navigationItem: createStyleResolver(resolveActionItem),
    navigationItemContent: createStyleResolver((): CardActionItemContentStyle => resolveItemContent()),
    navigationItemLabel: createStyleResolver(resolveActionLabel),
    navigationItemIcon: createValueResolver(resolveActionIcon),
    navigationItemTrailing: createValueResolver((): CardActionItemIconColor => ({
      color: colors.description as Color,
    })),
  }
}

export const createCardThemeFromDesign = (theme: HightideDesignSystemTokens): CardTheme => {
  return createCardTheme({
    colors: theme.colors,
    colorSchemes: theme.colorSchemes,
    card: theme.components.card,
  })
}
