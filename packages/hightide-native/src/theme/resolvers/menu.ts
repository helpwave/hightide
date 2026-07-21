import { StyleSheet } from 'react-native'
import { remToPx } from '@helpwave/hightide-design/helpers'
import { fontWeights } from '@helpwave/hightide-design/tokens'
import type {
  ComponentColors,
  DesignTokens as DesignTokensTheme,
  SemanticColors
} from '@helpwave/hightide-design/types'
import type { MenuActionItemState, MenuTheme } from '../types'
import { createStyleResolver, createValueResolver } from '../types/resolver'

export type CreateMenuThemeOptions = {
  semantic: SemanticColors,
  component: ComponentColors,
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
      gap: remToPx('0.75rem'),
      paddingHorizontal: remToPx('1rem'),
      paddingVertical: remToPx('0.5rem'),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
      backgroundColor: pressed ? semantic.surfaceHover : ('transparent' as const),
      opacity: state.isDisabled ? 0.6 : 1,
    }
  }

  const resolveItemContent = () => ({
    flex: 1,
    gap: remToPx('0.25rem'),
    justifyContent: 'center' as const,
  })

  const resolveActionLabel = (state: MenuActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.onSurface,
    fontSize: remToPx('0.9375rem'),
    fontWeight: fontWeights.medium,
  })

  const resolveActionIcon = (state: MenuActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.primary,
  })

  return {
    section: createStyleResolver(() => ({
      marginBottom: remToPx('1.25rem'),
      gap: remToPx('0.5rem'),
    })),
    sectionTitle: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
      fontWeight: fontWeights.bold,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      paddingHorizontal: remToPx('0.25rem'),
    })),
    card: createStyleResolver(() => ({
      backgroundColor: semantic.surface,
      borderRadius: remToPx('0.75rem'),
      borderWidth: 1,
      borderColor: component.border,
      overflow: 'hidden',
    })),
    item: createStyleResolver(() => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      paddingHorizontal: remToPx('1rem'),
      paddingVertical: remToPx('0.5rem'),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
      gap: remToPx('0.75rem'),
    })),
    itemContent: createStyleResolver(resolveItemContent),
    itemLabel: createStyleResolver(() => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
    })),
    itemValue: createStyleResolver(() => ({
      color: semantic.onSurface,
      fontSize: remToPx('0.9375rem'),
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
    semantic: theme.semantic,
    component: theme.component,
  })
}
