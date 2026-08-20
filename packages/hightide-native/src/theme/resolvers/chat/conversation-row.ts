import type {
  AvatarTokens
} from '@helpwave/hightide-design/component-token-resolvers'

import {
  createAvatarStyleResolvers,
  mergeAvatarTokens,
  toDesignAvatarSize,
  withNumericAvatarSize
} from '../avatar'
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

import { StyleAdapterUtils } from '../../adapters'

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
          ...StyleAdapterUtils.container(resolvePressable(pressableState).container),
          ...StyleAdapterUtils.container(pressableOverrides.container  = {}),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...StyleAdapterUtils.container(pressableOverrides.stateLayer  = {}),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...StyleAdapterUtils.text(resolvePressable(pressableState).text),
          ...StyleAdapterUtils.text(pressableOverrides.text  = {}),
        })),
        icon: createValueResolver((pressableState: PressableState): PressableIconStyle => ({
          ...StyleAdapterUtils.icon(resolvePressable(pressableState).icon),
          ...StyleAdapterUtils.icon(pressableOverrides.icon  = {}),
        })),
      }
    }),
    contentContainer: createStyleResolver((state: ChatConversationRowState): ChatConversationRowContentContainerStyle => (
      StyleAdapterUtils.container(resolve(state).contentContainer)
    )),
    headerRow: createStyleResolver((state: ChatConversationRowState): ChatConversationRowHeaderRowStyle => (
      StyleAdapterUtils.container(resolve(state).headerRow)
    )),
    messageRow: createStyleResolver((state: ChatConversationRowState): ChatConversationRowMessageRowStyle => (
      StyleAdapterUtils.container(resolve(state).messageRow)
    )),
    title: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTitleStyle => (
      StyleAdapterUtils.text(resolve(state).title)
    )),
    timestamp: createStyleResolver((state: ChatConversationRowState): ChatConversationRowTimestampStyle => (
      StyleAdapterUtils.text(resolve(state).timestamp)
    )),
    preview: createStyleResolver((state: ChatConversationRowState): ChatConversationRowPreviewStyle => (
      StyleAdapterUtils.text(resolve(state).preview)
    )),
    unreadBadge: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeStyle => (
      StyleAdapterUtils.container(resolve().unreadBadge)
    )),
    unreadBadgeText: createSimpleStyleResolver((): ChatConversationRowUnreadBadgeTextStyle => (
      StyleAdapterUtils.text(resolve().unreadBadgeText)
    )),
    sentIndicator: createSimpleValueResolver((): ChatConversationRowSentIndicatorStyle => (
      StyleAdapterUtils.icon(resolve().sentIndicator)
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
