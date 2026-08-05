import { hightideMultiSelectTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { MultiSelectComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type { Color } from '../types/color'
import type {
  MultiSelectCheckboxIconStyle,
  MultiSelectCheckboxStyle,
  MultiSelectOptionState,
  MultiSelectOptionStyle,
  MultiSelectOptionTextStyle,
  MultiSelectState,
  MultiSelectTheme,
  MultiSelectTriggerStyle
} from '../types/components/multiSelect'
import type {
  SelectMenuStyle,
  SelectOverlayStyle,
  SelectSearchStyle,
  SelectTriggerTextStyle
} from '../types/components/select'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const emptyProps = (): MultiSelectComponentResolverProps => ({
  state: {},
})

const toTriggerTokenProps = (state: MultiSelectState): MultiSelectComponentResolverProps => ({
  state: {
    isDisabled: state.isDisabled,
    isInvalid: state.isInvalid,
    isOpen: state.isOpen,
    hasSelections: state.hasSelections,
  },
})

const toOptionTokenProps = (state: MultiSelectOptionState): MultiSelectComponentResolverProps => ({
  state: {
    isDisabled: state.isDisabled,
    isSelected: state.isSelected,
    isHighlighted: state.isHighlighted,
  },
})

export const toMultiSelectTheme = (themeTokens: ThemeTokens): MultiSelectTheme => {
  const resolve = (props: MultiSelectComponentResolverProps) => hightideMultiSelectTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...props,
  })

  return {
    trigger: createStyleResolver((state: MultiSelectState): MultiSelectTriggerStyle => ({
      ...resolve(toTriggerTokenProps(state)).trigger,
    })),
    triggerText: createSimpleStyleResolver((): SelectTriggerTextStyle => (
      toTextStyle(resolve(emptyProps()).triggerText)
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
    option: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionStyle => ({
      ...resolve(toOptionTokenProps(state)).option,
    })),
    optionText: createStyleResolver((state: MultiSelectOptionState): MultiSelectOptionTextStyle => (
      toTextStyle(resolve(toOptionTokenProps(state)).optionText)
    )),
    checkbox: createStyleResolver((state: MultiSelectOptionState): MultiSelectCheckboxStyle => ({
      ...resolve(toOptionTokenProps(state)).checkbox,
    })),
    checkboxIcon: createValueResolver((state: MultiSelectOptionState): MultiSelectCheckboxIconStyle => {
      const { checkboxIcon } = resolve(toOptionTokenProps(state))

      return {
        color: checkboxIcon.color,
        visible: checkboxIcon.isVisible,
      }
    }),
  }
}
