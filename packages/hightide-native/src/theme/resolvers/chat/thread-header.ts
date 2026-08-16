import type { AvatarTokens } from '@helpwave/hightide-design/component-token-resolvers'

import {
  createAvatarStyleResolvers,
  mergeAvatarTokens,
  toDesignAvatarSize,
  withNumericAvatarSize
} from '../avatar'
import { toContainerStyle } from '../../adapters/container-adapter'
import { toTextStyle } from '../../adapters/text-style-adapter'
import type {
  ChatThreadHeaderContentRowStyle,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderThemeResolvers,
  ChatThreadHeaderTitleStyle
} from '../../types/components/chat'
import type {
  AvatarState,
  AvatarThemeResolvers
} from '../../types/components/avatar'
import {
  createSimpleStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatThreadHeaderThemeResolvers: ComponentThemeResolver<ChatThreadHeaderThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.chat.threadHeader({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatThreadHeaderStyle => (
      toContainerStyle(resolve().container)
    )),
    contentRow: createSimpleStyleResolver((): ChatThreadHeaderContentRowStyle => ({
      ...toContainerStyle(resolve().contentRow),
      flex: 1,
    })),
    title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => (
      toTextStyle(resolve().title)
    )),
    subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => (
      toTextStyle(resolve().subtitle)
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

        const size = avatarState.size ?? state.size
        if (typeof size === 'number') {
          return withNumericAvatarSize(tokens, size)
        }

        return tokens
      }

      return createAvatarStyleResolvers(resolveTokens, themeTokens)
    }),
  }
}
