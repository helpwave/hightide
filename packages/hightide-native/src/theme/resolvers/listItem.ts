import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ListActionItemContentStyle,
  ListActionItemIconStyle,
  ListActionItemState,
  ListActionItemStyle,
  ListActionItemThemeResolvers,
  ListActionItemTitleStyle,
  ListItemContentStyle,
  ListItemDefaultThemeResolvers,
  ListItemDescriptionStyle,
  ListItemIconStyle,
  ListItemState,
  ListItemStyle,
  ListItemThemeResolvers,
  ListItemTitleStyle,
  ListNavigationItemContentStyle,
  ListNavigationItemIconStyle,
  ListNavigationItemState,
  ListNavigationItemStyle,
  ListNavigationItemThemeResolvers,
  ListNavigationItemTitleStyle
} from '../types/components/listItem'
import {
  createStyleResolver,
  createValueResolver,
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
    content: createStyleResolver((state: ListItemState): ListItemContentStyle => ({
      ...toContainerStyle(resolve(state).content),
      flex: 1,
    })),
    descriptionText: createStyleResolver((state: ListItemState): ListItemDescriptionStyle => (
      toTextStyle(resolve(state).descriptionText)
    )),
    titleText: createStyleResolver((state: ListItemState): ListItemTitleStyle => (
      toTextStyle(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListItemState): ListItemIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
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
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isPressed: state.isPressed,
    },
  })

  return {
    container: createStyleResolver((state: ListActionItemState): ListActionItemStyle => ({
      ...toContainerStyle(resolve(state).container),
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    content: createStyleResolver((state: ListActionItemState): ListActionItemContentStyle => ({
      ...toContainerStyle(resolve(state).content),
      flex: 1,
    })),
    titleText: createStyleResolver((state: ListActionItemState): ListActionItemTitleStyle => (
      toTextStyle(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListActionItemState): ListActionItemIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
  }
}

const toListNavigationItemThemeResolvers: ComponentThemeResolver<ListNavigationItemThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ListNavigationItemState = {}) => componentTokens.listItem.navigation({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isPressed: state.isPressed,
    },
  })

  return {
    container: createStyleResolver((state: ListNavigationItemState): ListNavigationItemStyle => ({
      ...toContainerStyle(resolve(state).container),
      opacity: state.isDisabled ? 0.6 : 1,
    })),
    content: createStyleResolver((state: ListNavigationItemState): ListNavigationItemContentStyle => ({
      ...toContainerStyle(resolve(state).content),
      flex: 1,
    })),
    titleText: createStyleResolver((state: ListNavigationItemState): ListNavigationItemTitleStyle => (
      toTextStyle(resolve(state).titleText)
    )),
    icon: createValueResolver((state: ListNavigationItemState): ListNavigationItemIconStyle => {
      const { icon } = resolve(state)

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
  }
}

export const toListItemThemeResolvers: ComponentThemeResolver<ListItemThemeResolvers> = (params) => ({
  default: toListItemDefaultThemeResolvers(params),
  action: toListActionItemThemeResolvers(params),
  navigation: toListNavigationItemThemeResolvers(params),
})
