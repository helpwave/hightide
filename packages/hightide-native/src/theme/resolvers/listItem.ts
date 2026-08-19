import type {
  ListActionItemContentStyle,
  ListActionItemDescriptionStyle,
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

import { StyleAdapterUtils } from '../adapters'

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
      StyleAdapterUtils.container(resolve(state).container)
    )),
    leadingItemContainer: createStyleResolver((state: ListItemState): ListItemLeadingItemContainerStyle => (
      StyleAdapterUtils.container(resolve(state).leadingItemContainer)
    )),
    content: createStyleResolver((state: ListItemState): ListItemContentStyle => ({
      ...StyleAdapterUtils.container(resolve(state).content),
      flex: 1,
    })),
    trailingItemContainer: createStyleResolver((state: ListItemState): ListItemTrailingItemContainerStyle => (
      StyleAdapterUtils.container(resolve(state).trailingItemContainer)
    )),
    descriptionText: createStyleResolver((state: ListItemState): ListItemDescriptionStyle => (
      StyleAdapterUtils.text(resolve(state).descriptionText)
    )),
    titleText: createStyleResolver((state: ListItemState): ListItemTitleStyle => (
      StyleAdapterUtils.text(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListItemState): ListItemIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
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
      StyleAdapterUtils.container(resolve(state).container)
    )),
    leadingItemContainer: createStyleResolver((state: ListActionItemState): ListActionItemLeadingItemContainerStyle => (
      StyleAdapterUtils.container(resolve(state).leadingItemContainer)
    )),
    content: createStyleResolver((state: ListActionItemState): ListActionItemContentStyle => ({
      ...StyleAdapterUtils.container(resolve(state).content),
      flex: 1,
    })),
    trailingItemContainer: createStyleResolver((state: ListActionItemState): ListActionItemTrailingItemContainerStyle => (
      StyleAdapterUtils.container(resolve(state).trailingItemContainer)
    )),
    titleText: createStyleResolver((state: ListActionItemState): ListActionItemTitleStyle => (
      StyleAdapterUtils.text(resolve(state).titleText)
    )),
    descriptionText: createStyleResolver((state: ListActionItemState): ListActionItemDescriptionStyle => (
      StyleAdapterUtils.text(resolve(state).descriptionText)
    )),
    icon: createValueResolver((state: ListActionItemState): ListActionItemIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
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
