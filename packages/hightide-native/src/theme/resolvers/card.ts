import { hightideCardTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type { CardState as CardTokenState } from '@helpwave/hightide-design/component-token-resolvers'
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

const toTokenState = (state: CardActionItemState): CardTokenState => ({
  isPressed: state.isPressed,
  isDisabled: state.isDisabled,
  isDanger: state.isDanger,
})

export const toCardTheme = (themeTokens: ThemeTokens): CardTheme => {
  const resolve = (state: CardTokenState) => hightideCardTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state,
  })

  return {
    card: createSimpleStyleResolver((): CardStyle => ({
      ...resolve({}).container,
    })),
    item: createSimpleStyleResolver((): CardItemStyle => ({
      ...resolve({}).item,
    })),
    itemContent: createSimpleStyleResolver((): CardItemContentStyle => ({
      ...resolve({}).itemContent,
    })),
    itemLabel: createSimpleStyleResolver((): CardItemLabelStyle => (
      toTextStyle(resolve({}).itemLabel)
    )),
    itemValue: createSimpleStyleResolver((): CardItemValueStyle => (
      toTextStyle(resolve({}).itemValue)
    )),
    actionItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve(toTokenState(state)).actionItem,
    })),
    actionItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve({}).actionItemContent,
    })),
    actionItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve(toTokenState(state)).actionItemLabel)
    )),
    actionItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve(toTokenState(state)).actionItemIcon.color,
    })),
    navigationItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve(toTokenState(state)).navigationItem,
    })),
    navigationItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve({}).navigationItemContent,
    })),
    navigationItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve(toTokenState(state)).navigationItemLabel)
    )),
    navigationItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve(toTokenState(state)).navigationItemIcon.color,
    })),
    navigationItemTrailing: createSimpleValueResolver((): CardActionItemIconColor => ({
      color: resolve({}).navigationItemTrailing.color,
    })),
  }
}
