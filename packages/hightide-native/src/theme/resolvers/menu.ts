import { StyleSheet } from 'react-native'

import { fontWeights } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColorTokens,
  HightideDesignTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

import type { HightideSemanticColors } from '../types/color'
import type {
  MenuActionItemState,
  MenuTheme
} from '../types/components/menu'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateMenuThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
}

export const createMenuTheme = ({
  semantic,
  component,
}: CreateMenuThemeOptions): MenuTheme => {
  const resolveActionItem = (state: MenuActionItemState) => {
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

  const resolveActionLabel = (state: MenuActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.onSurface,
    fontSize: 15,
    fontWeight: fontWeights.medium,
  })

  const resolveActionIcon = (state: MenuActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.primary,
  })

  return {
    section: createStyleResolver(() => ({
      marginBottom: 20,
      gap: 8,
    })),
    sectionTitle: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: 12,
      fontWeight: fontWeights.bold,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      paddingHorizontal: 4,
    })),
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

export const createMenuThemeFromDesign = (theme: DesignTokensTheme): MenuTheme => {
  return createMenuTheme({
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
