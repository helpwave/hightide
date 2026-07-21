import { StyleSheet } from 'react-native'
import {
  remToPx,
  type ComponentColors,
  type DesignTheme as DesignTokensTheme,
  type SemanticColors
} from '@helpwave/hightide-design'
import type {
  MenuActionItemState,
  MenuTheme
} from '../types'

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
    fontWeight: '500' as const,
  })

  const resolveActionIcon = (state: MenuActionItemState) => ({
    color: state.isDanger ? semantic.negative : semantic.primary,
  })

  return {
    section: () => ({
      marginBottom: remToPx('1.25rem'),
      gap: remToPx('0.5rem'),
    }),
    sectionTitle: () => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
      fontWeight: '700',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      paddingHorizontal: remToPx('0.25rem'),
    }),
    card: () => ({
      backgroundColor: semantic.surface,
      borderRadius: remToPx('0.75rem'),
      borderWidth: 1,
      borderColor: component.border,
      overflow: 'hidden',
    }),
    item: () => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 64,
      paddingHorizontal: remToPx('1rem'),
      paddingVertical: remToPx('0.5rem'),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: component.divider,
      gap: remToPx('0.75rem'),
    }),
    itemContent: resolveItemContent,
    itemLabel: () => ({
      color: semantic.description,
      fontSize: remToPx('0.75rem'),
    }),
    itemValue: () => ({
      color: semantic.onSurface,
      fontSize: remToPx('0.9375rem'),
      fontWeight: '500',
    }),
    actionItem: resolveActionItem,
    actionItemContent: resolveItemContent,
    actionItemLabel: resolveActionLabel,
    actionItemIcon: resolveActionIcon,
    navigationItem: resolveActionItem,
    navigationItemContent: resolveItemContent,
    navigationItemLabel: resolveActionLabel,
    navigationItemIcon: resolveActionIcon,
    navigationItemTrailing: () => ({
      color: semantic.description,
    }),
  }
}

export const createMenuThemeFromDesign = (theme: DesignTokensTheme): MenuTheme => {
  return createMenuTheme({
    semantic: theme.semantic,
    component: theme.component,
  })
}
