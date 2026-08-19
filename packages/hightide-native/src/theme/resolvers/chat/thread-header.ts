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
    contentRow: createSimpleStyleResolver((): ChatThreadHeaderContentRowStyle => (
      toContainerStyle(resolve().contentRow)
    )),
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

        const size = avatarState.size ?? state.size ?? avatarOverride.container?.size?.width
        if (typeof size === 'number') {
          return withNumericAvatarSize(tokens, size)
        }

        return tokens
      }

      return createAvatarStyleResolvers(resolveTokens, themeTokens)
    }),
    pressable: createValueResolver(() => {
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
          ...toContainerStyle(resolvePressable(pressableState).container),
          ...toOptionalContainerStyle(pressableOverwrites.container),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...toOptionalContainerStyle(pressableOverwrites.stateLayer),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...toTextStyle(resolvePressable(pressableState).text),
          ...toOptionalTextStyle(pressableOverwrites.text),
        })),
        icon: createValueResolver((pressableState: PressableState): PressableIconStyle => ({
          ...toIconStyle(resolvePressable(pressableState).icon),
          ...toOptionalIconStyle(pressableOverwrites.icon),
        })),
      }
    }),
  }
}
