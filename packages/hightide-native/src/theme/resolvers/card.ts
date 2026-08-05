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
  CardThemeResolvers
} from '../types/components/card'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toCardThemeResolvers: ComponentThemeResolver<CardThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: {
    isPressed?: boolean,
    isDisabled?: boolean,
    isDanger?: boolean,
  } = {}) => componentTokens.card({
    themeTokens,
    semanticResolvers: semanticTokens,
    state,
  })

  return {
    card: createSimpleStyleResolver((): CardStyle => ({
      ...resolve().container,
    })),
    item: createSimpleStyleResolver((): CardItemStyle => ({
      ...resolve().item,
    })),
    itemContent: createSimpleStyleResolver((): CardItemContentStyle => ({
      ...resolve().itemContent,
    })),
    itemLabel: createSimpleStyleResolver((): CardItemLabelStyle => (
      toTextStyle(resolve().itemLabel)
    )),
    itemValue: createSimpleStyleResolver((): CardItemValueStyle => (
      toTextStyle(resolve().itemValue)
    )),
    actionItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).actionItem,
    })),
    actionItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve().actionItemContent,
    })),
    actionItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).actionItemLabel)
    )),
    actionItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).actionItemIcon.color,
    })),
    navigationItem: createStyleResolver((state: CardActionItemState): CardActionItemStyle => ({
      ...resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).navigationItem,
    })),
    navigationItemContent: createSimpleStyleResolver((): CardActionItemContentStyle => ({
      ...resolve().navigationItemContent,
    })),
    navigationItemLabel: createStyleResolver((state: CardActionItemState): CardActionItemLabelStyle => (
      toTextStyle(resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).navigationItemLabel)
    )),
    navigationItemIcon: createValueResolver((state: CardActionItemState): CardActionItemIconColor => ({
      color: resolve({
        isPressed: state.isPressed,
        isDisabled: state.isDisabled,
        isDanger: state.isDanger,
      }).navigationItemIcon.color,
    })),
    navigationItemTrailing: createSimpleValueResolver((): CardActionItemIconColor => ({
      color: resolve().navigationItemTrailing.color,
    })),
  }
}
