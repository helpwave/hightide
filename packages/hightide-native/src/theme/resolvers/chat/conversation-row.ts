import type {
  AvatarTokens,
  ContainerTokens,
  IconTokens,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'

import {
  createAvatarStyleResolvers,
  mergeAvatarTokens,
  toDesignAvatarSize,
  withNumericAvatarSize
} from '../avatar'
import { toContainerStyle } from '../../adapters/container-adapter'
import { toIconStyle } from '../../adapters/icon-style-adapter'
import { toTextStyle } from '../../adapters/text-style-adapter'
import type {
  ChatConversationRowContentContainerStyle,
  ChatConversationRowHeaderRowStyle,
  ChatConversationRowMessageRowStyle,
  ChatConversationRowPreviewStyle,
  ChatConversationRowSentIndicatorStyle,
  ChatConversationRowState,
  ChatConversationRowThemeResolvers,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  ChatConversationRowUnreadBadgeStyle,
  ChatConversationRowUnreadBadgeTextStyle,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../types/components/chat'
import type {
  AvatarState,
  AvatarThemeResolvers
} from '../../types/components/avatar'
import {
  createSimpleStyleResolver,
  createSimpleValueResolver,
  createStyleResolver,
  createValueResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../../types/resolver'

const toOptionalContainerStyle = (tokens?: ContainerTokens): PressableContainerStyle => (
  tokens === undefined ? {} : toContainerStyle(tokens)
)

const toOptionalTextStyle = (tokens?: TextStyleTokens): PressableTextStyle => (
  tokens === undefined ? {} : toTextStyle(tokens)
)

const toOptionalIconStyle = (tokens?: IconTokens): PressableIconStyle => (
  tokens === undefined ? {} : toIconStyle(tokens)
)

export const toChatConversationRowThemeResolvers: ComponentThemeResolver<ChatConversationRowThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ChatConversationRowState = {}) => componentTokens.chat.conversationRow({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isPressed: state.isPressed,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isDisabled: state.isDisabled,
      isUnread: state.isUnread,
      isSelected: state.isSelected,
    },
  })

  return {
    pressable: createValueResolver((state: ChatConversationRowState) => {
      const { pressableOverrides } = resolve(state)

      const resolvePressable = (pressableState: PressableState) => componentTokens.pressable({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: {
          size: pressableOverrides.overrides?.size,
          color: pressableOverrides.overrides?.color,
          coloringStyle: pressableOverrides.overrides?.coloringStyle,
          coloringColorVariant: pressableOverrides.overrides?.coloringColorVariant,
          hasAdditionalHorizontalPadding: pressableOverrides.overrides?.hasAdditionalHorizontalPadding,
        },
        state: toPressableInteractionState(pressableState),
      })

      return {
        container: createStyleResolver((pressableState: PressableState): PressableContainerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).container),
          ...toOptionalContainerStyle(pressableOverrides.container),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...toOptionalContainerStyle(pressableOverrides.stateLayer),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...toTextStyle(resolvePressable(pressableState).text),
          ...toOptionalTextStyle(pressableOverrides.text),
        })),
        icon: createValueResolver((pressableState: PressableState): PressableIconStyle => ({
          ...toIconStyle(resolvePressable(pressableState).icon),
          ...toOptionalIconStyle(pressableOverrides.icon),
        })),
      }
    }),
    contentContainer: createStyleResolver((state: ChatConversationRowState): ChatConversationRowContentContainerStyle => (
      toContainerStyle(resolve(state).contentContainer)
    )),
    headerRow: createStyleResolver((state: ChatConversationRowState): ChatConversationRowHeaderRowStyle => (
      toContainerStyle(resolve(state).headerRow)
    )),
    messageRow: createStyleResolver((state: ChatConversationRowState): ChatConversationRowMessageRowStyle => (
      toContainerStyle(resolve(state).messageRow)
    )),
    title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => (
      toTextStyle(resolve(state).title)
    )),
    timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => (
      toTextStyle(resolve(state).timestamp)
    )),
    preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => (
      toTextStyle(resolve(state).preview)
    )),
    unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => (
      toContainerStyle(resolve().unreadBadge)
    )),
    unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => (
      toTextStyle(resolve().unreadBadgeText)
    )),
    sentIndicator: createSimpleValueResolver((): ChatConversationRowSentIndicatorStyle => (
      toIconStyle(resolve().sentIndicator)
    )),
    avatar: createValueResolver((state: AvatarState): AvatarThemeResolvers => {
      const { avatarOverride } = resolve()

      const resolveTokens = (avatarState: AvatarState): AvatarTokens => {
        const tokens = mergeAvatarTokens(
          componentTokens.avatar({
            themeTokens,
            semanticResolvers: semanticTokens,
            config: {
              isGrouped: avatarState.isGrouped,
              groupIndex: avatarState.groupIndex,
            },
            overrides: {
              color: avatarState.color ?? state.color ?? avatarOverride.overrides?.color,
              size: toDesignAvatarSize(
                avatarState.size ?? state.size ?? avatarOverride.overrides?.size
              ),
            },
          }),
          avatarOverride
        )

        const size = avatarState.size ?? state.size ?? avatarOverride.container?.size?.width
        if (typeof size === 'number') {
          return withNumericAvatarSize(tokens, size)
        }

        return tokens
      }

      return createAvatarStyleResolvers(resolveTokens, themeTokens)
    }),
  }
}
