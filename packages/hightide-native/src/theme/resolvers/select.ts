import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import { hightideTypography } from '@helpwave/hightide-design/primitive-tokens'
import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'
import type { HightideSematicColorSchemeTokens, HightideSemanticColorTokens } from '@helpwave/hightide-design/semantic-tokens'

import type {
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTheme,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import type { Color } from '../types/color'
import {
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

export type CreateSelectThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideSematicColorSchemeTokens,
  input: HightideComponentTokens['input'],
  card: HightideComponentTokens['card'],
}

export const createSelectTheme = ({
  colors,
  colorSchemes,
  input,
  card,
}: CreateSelectThemeOptions): SelectTheme => {
  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => {
      const style: ViewStyle = {
        minHeight: 44,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: state.isInvalid
          ? colorSchemes.negative.text.base.foreground
          : colors.border,
        backgroundColor: state.isDisabled ? colors.disabled : input.background,
        justifyContent: 'center',
        opacity: state.isDisabled ? 0.6 : 1,
      }
      return style
    }),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => {
      const style: TextStyle = {
        color: state.hasValue ? input.text : colors.placeholder,
      }
      return style
    }),
    overlay: createStyleResolver((): SelectOverlayStyle => {
      const style: ViewStyle = {
        flex: 1,
        backgroundColor: '#00000059',
        justifyContent: 'center',
        padding: 24,
      }
      return style
    }),
    menu: createStyleResolver((): SelectMenuStyle => {
      const style: ViewStyle = {
        maxHeight: 360,
        borderRadius: 12,
        backgroundColor: card.background,
        borderWidth: 1,
        borderColor: card.border,
        overflow: 'hidden',
      }
      return style
    }),
    search: createStyleResolver((): SelectSearchStyle => {
      const style: TextStyle = {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: card.border,
        color: card.text,
      }
      return style
    }),
    searchPlaceholderColor: createValueResolver((): Color => colors.placeholder),
    option: createStyleResolver((state: SelectOptionState): SelectOptionStyle => {
      const style: ViewStyle = {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: state.isHighlighted ? colors.surfaceHover : colors.transparent,
        opacity: state.isDisabled ? 0.5 : 1,
      }
      return style
    }),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => {
      const style: TextStyle = {
        color: state.isSelected ? colorSchemes.primary.text.base.foreground : card.text,
        fontWeight: (state.isSelected
          ? hightideTypography.fontWeight.semibold
          : hightideTypography.fontWeight.base) as TextStyle['fontWeight'],
      }
      return style
    }),
  }
}

export const createSelectThemeFromDesign = (theme: HightideDesignSystemTokens): SelectTheme => {
  return createSelectTheme({
    colors: theme.colors,
    colorSchemes: theme.colorSchemes,
    input: theme.components.input,
    card: theme.components.card,
  })
}
