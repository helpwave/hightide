import { StyleSheet } from 'react-native'

import { fontWeights } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideThemeTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

import type { HightideSemanticColors } from '../types/color'
import type {
  CardActionItemState,
  CardTheme
} from '../types/components/card'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateCardThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
}

export const createCardTheme = ({
  semantic,
  component,
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
      borderBottomColor: component.divider,
      backgroundColor: pressed ? semantic.surfaceHover : ('transparent' as const),
      opacity: state.isDisabled ? 0.6 : 1,
    }
  }

  const resolveItemContent = () => ({
    flex: 1,
    gap: 4,
    justifyContent: 'center' as const,
  })

  const resolveActionLabel = (state: CardActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.onSurface,
    fontSize: 15,
    fontWeight: fontWeights.medium,
  })

  const resolveActionIcon = (state: CardActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.primary,
  })

  return {
    card: createStyleResolver(() => ({
      backgroundColor: semantic.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: component.border,
      overflow: 'hidden',
    })),
    item: createStyleResolver(() => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
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
      fontWeight: fontWeights.medium,
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
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
