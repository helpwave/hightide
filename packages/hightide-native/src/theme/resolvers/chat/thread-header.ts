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
  ChatThreadHeaderContentRowStyle,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderThemeResolvers,
  ChatThreadHeaderTitleStyle,
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
  createStyleResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

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
      StyleAdapterUtils.container(resolve().container)
    )),
    contentRow: createSimpleStyleResolver((): ChatThreadHeaderContentRowStyle => (
      StyleAdapterUtils.container(resolve().contentRow)
    )),
    title: createSimpleStyleResolver((): ChatThreadHeaderTitleStyle => (
      StyleAdapterUtils.text(resolve().title)
    )),
    subtitle: createSimpleStyleResolver((): ChatThreadHeaderSubtitleStyle => (
      StyleAdapterUtils.text(resolve().subtitle)
    )),
    avatar: createStyleResolver((state: AvatarState): AvatarThemeResolvers => {
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
    pressable: createStyleResolver(() => {
      const { pressableOverwrites } = resolve()

      const resolvePressable = (pressableState: PressableState) => componentTokens.pressable({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: {
          size: pressableOverwrites.overrides?.size,
          color: pressableOverwrites.overrides?.color,
          coloringStyle: pressableOverwrites.overrides?.coloringStyle,
          coloringColorVariant: pressableOverwrites.overrides?.coloringColorVariant,
          hasAdditionalHorizontalPadding: pressableOverwrites.overrides?.hasAdditionalHorizontalPadding,
        },
        state: toPressableInteractionState(pressableState),
      })

      return {
        container: createStyleResolver((pressableState: PressableState): PressableContainerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).container),
          ...StyleAdapterUtils.container(pressableOverwrites.container = {}),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...StyleAdapterUtils.container(pressableOverwrites.stateLayer = {}),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...StyleAdapterUtils.text(resolvePressable(pressableState).text),
          ...StyleAdapterUtils.text(pressableOverwrites.text = {}),
        })),
        icon: createStyleResolver((pressableState: PressableState): PressableIconStyle => ({
          ...StyleAdapterUtils.icon(resolvePressable(pressableState).icon),
          ...StyleAdapterUtils.icon(pressableOverwrites.icon = {}),
        })),
      }
    }),
  }
}
