import { hightideSelectTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { SelectComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  SelectMenuStyle,
  SelectOptionState,
  SelectOptionStyle,
  SelectOptionTextStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectState,
  SelectTheme,
  SelectTriggerStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver
} from '../types/resolver'

const emptyProps = (): SelectComponentResolverProps => ({
  state: {},
})

const toTriggerTokenProps = (state: SelectState): SelectComponentResolverProps => ({
  state: {
    isDisabled: state.isDisabled,
    isInvalid: state.isInvalid,
    isOpen: state.isOpen,
    hasValue: state.hasValue,
  },
})

const toOptionTokenProps = (state: SelectOptionState): SelectComponentResolverProps => ({
  state: {
    isDisabled: state.isDisabled,
    isSelected: state.isSelected,
    isHighlighted: state.isHighlighted,
  },
})

export const toSelectTheme = (themeTokens: ThemeTokens): SelectTheme => {
  const resolve = (props: SelectComponentResolverProps) => hightideSelectTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...props,
  })

  return {
    trigger: createStyleResolver((state: SelectState): SelectTriggerStyle => ({
      ...resolve(toTriggerTokenProps(state)).trigger,
    })),
    triggerText: createStyleResolver((state: SelectState): SelectTriggerTextStyle => (
      toTextStyle(resolve(toTriggerTokenProps(state)).triggerText)
    )),
    overlay: createSimpleStyleResolver((): SelectOverlayStyle => ({
      ...resolve(emptyProps()).overlay,
    })),
    menu: createSimpleStyleResolver((): SelectMenuStyle => ({
      ...resolve(emptyProps()).menu,
    })),
    search: createSimpleStyleResolver((): SelectSearchStyle => ({
      ...resolve(emptyProps()).search,
    })),
    searchPlaceholderColor: createSimpleValueResolver((): Color => (
      resolve(emptyProps()).searchPlaceholderColor
    )),
    option: createStyleResolver((state: SelectOptionState): SelectOptionStyle => ({
      ...resolve(toOptionTokenProps(state)).option,
    })),
    optionText: createStyleResolver((state: SelectOptionState): SelectOptionTextStyle => (
      toTextStyle(resolve(toOptionTokenProps(state)).optionText)
    )),
  }
}
