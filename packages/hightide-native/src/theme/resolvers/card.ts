import { hightideCardTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { CardComponentResolverProps } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
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
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver
} from '../types/resolver'

const emptyProps = (): CardComponentResolverProps => ({
  state: {},
})

const toTokenProps = (state: CardActionItemState): CardComponentResolverProps => ({
  state: {
    isPressed: state.isPressed,
    isDisabled: state.isDisabled,
    isDanger: state.isDanger,
  },
})

export const toCardTheme = (themeTokens: ThemeTokens): CardTheme => {
  const resolve = (props: CardComponentResolverProps) => hightideCardTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...props,
  })

  return {
    card: createSimpleStyleResolver((): CardStyle => ({
      ...resolve(emptyProps()).container,
    })),
    item: createSimpleStyleResolver((): CardItemStyle => ({
      ...resolve(emptyProps()).item,
    })),
    itemContent: createSimpleStyleResolver((): CardItemContentStyle => ({
      ...resolve(emptyProps()).itemContent,
    })),
    itemLabel: createSimpleStyleResolver((): CardItemLabelStyle => (
      toTextStyle(resolve(emptyProps()).itemLabel)
    )),
    itemValue: createSimpleStyleResolver((): CardItemValueStyle => (
      toTextStyle(resolve(emptyProps()).itemValue)
    )),
    actionItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve(toTokenProps(state)).actionItem,
    })),
    actionItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve(emptyProps()).actionItemContent,
    })),
    actionItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve(toTokenProps(state)).actionItemLabel)
    )),
    actionItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve(toTokenProps(state)).actionItemIcon.color,
    })),
    navigationItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve(toTokenProps(state)).navigationItem,
    })),
    navigationItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve(emptyProps()).navigationItemContent,
    })),
    navigationItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve(toTokenProps(state)).navigationItemLabel)
    )),
    navigationItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve(toTokenProps(state)).navigationItemIcon.color,
    })),
    navigationItemTrailing: createSimpleValueResolver((): CardActionItemIconColor => ({
      color: resolve(emptyProps()).navigationItemTrailing.color,
    })),
  }
}
