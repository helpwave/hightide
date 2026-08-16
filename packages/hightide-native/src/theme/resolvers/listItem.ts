import { toContainerStyle } from '../adapters/container-adapter'
import { toIconStyle } from '../adapters/icon-style-adapter'
import { toTextStyle } from '../adapters/text-style-adapter'
import type {
  ListActionItemContentStyle,
  ListActionItemIconStyle,
  ListActionItemLeadingItemContainerStyle,
  ListActionItemState,
  ListActionItemStyle,
  ListActionItemThemeResolvers,
  ListActionItemTitleStyle,
  ListActionItemTrailingItemContainerStyle,
  ListItemContentStyle,
  ListItemDefaultThemeResolvers,
  ListItemDescriptionStyle,
  ListItemIconStyle,
  ListItemLeadingItemContainerStyle,
  ListItemState,
  ListItemStyle,
  ListItemThemeResolvers,
  ListItemTitleStyle,
  ListItemTrailingItemContainerStyle
} from '../types/components/listItem'
import {
  createStyleResolver,
  createValueResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../types/resolver'

const toListItemDefaultThemeResolvers: ComponentThemeResolver<ListItemDefaultThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ListItemState = {}) => componentTokens.listItem.default({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
  })

  return {
    container: createStyleResolver((state: ListItemState): ListItemStyle => (
      toContainerStyle(resolve(state).container)
    )),
    leadingItemContainer: createStyleResolver((state: ListItemState): ListItemLeadingItemContainerStyle => (
      toContainerStyle(resolve(state).leadingItemContainer)
    )),
    content: createStyleResolver((state: ListItemState): ListItemContentStyle => ({
      ...toContainerStyle(resolve(state).content),
      flex: 1,
    })),
    trailingItemContainer: createStyleResolver((state: ListItemState): ListItemTrailingItemContainerStyle => (
      toContainerStyle(resolve(state).trailingItemContainer)
    )),
    descriptionText: createStyleResolver((state: ListItemState): ListItemDescriptionStyle => (
      toTextStyle(resolve(state).descriptionText)
    )),
    titleText: createStyleResolver((state: ListItemState): ListItemTitleStyle => (
      toTextStyle(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListItemState): ListItemIconStyle => (
      toIconStyle(resolve(state).icon)
    )),
  }
}

const toListActionItemThemeResolvers: ComponentThemeResolver<ListActionItemThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ListActionItemState = {}) => componentTokens.listItem.action({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: toPressableInteractionState(state),
  })

  return {
    container: createStyleResolver((state: ListActionItemState): ListActionItemStyle => (
      toContainerStyle(resolve(state).container)
    )),
    leadingItemContainer: createStyleResolver((state: ListActionItemState): ListActionItemLeadingItemContainerStyle => (
      toContainerStyle(resolve(state).leadingItemContainer)
    )),
    content: createStyleResolver((state: ListActionItemState): ListActionItemContentStyle => ({
      ...toContainerStyle(resolve(state).content),
      flex: 1,
    })),
    trailingItemContainer: createStyleResolver((state: ListActionItemState): ListActionItemTrailingItemContainerStyle => (
      toContainerStyle(resolve(state).trailingItemContainer)
    )),
    titleText: createStyleResolver((state: ListActionItemState): ListActionItemTitleStyle => (
      toTextStyle(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListActionItemState): ListActionItemIconStyle => (
      toIconStyle(resolve(state).icon)
    )),
  }
}

export const toListItemThemeResolvers: ComponentThemeResolver<ListItemThemeResolvers> = (params) => {
  const action = toListActionItemThemeResolvers(params)

  return {
    default: toListItemDefaultThemeResolvers(params),
    action,
    navigation: action,
  }
}
