import { hightideAvatarTokenResolver } from '@helpwave/hightide-design/component-token-resolvers'
import type {
  AvatarContainerTokens,
  AvatarState as AvatarTokenState
} from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type {
  AvatarGroupContainerStyle,
  AvatarGroupMoreStyle,
  AvatarGroupStackStyle,
  AvatarGroupState,
  AvatarIconStyle,
  AvatarImageStyle,
  AvatarState,
  AvatarStatusDotStyle,
  AvatarStyle,
  AvatarTextStyle,
  AvatarTheme,
  AvatarWithLabelContainerStyle,
  AvatarWithLabelState,
  AvatarWithLabelTextStyle,
  AvatarWithStatusContainerStyle,
  AvatarWithStatusState
} from '../types/components/avatar'
import { createStyleResolver, createValueResolver } from '../types/resolver'

const toAvatarStyle = (tokens: AvatarContainerTokens): AvatarStyle => {
  const { shadow, ...container } = tokens

  return {
    ...container,
    minWidth: container.width,
    maxWidth: container.width,
    minHeight: container.height,
    maxHeight: container.height,
    ...(shadow ? {
      shadowColor: shadow.color,
      shadowOffset: { width: shadow.offsetX, height: shadow.offsetY },
      shadowOpacity: 1,
      shadowRadius: shadow.blur,
      elevation: shadow.elevation,
    } : {}),
  }
}

export const toAvatarTheme = (themeTokens: ThemeTokens): AvatarTheme => {
  const resolve = (state: AvatarTokenState) => hightideAvatarTokenResolver({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    state,
  })

  return {
    container: createStyleResolver((state: AvatarState): AvatarStyle => (
      toAvatarStyle(resolve({
        size: state.size,
        isGrouped: state.isGrouped,
        groupIndex: state.groupIndex,
        color: state.color,
      }).container)
    )),
    image: createStyleResolver((state: AvatarState): AvatarImageStyle => ({
      ...resolve({ size: state.size, color: state.color }).image,
    })),
    text: createStyleResolver((state: AvatarState): AvatarTextStyle => {
      const { text } = resolve({ size: state.size, color: state.color })

      return {
        ...toTextStyle(text),
        textAlign: text.textAlign,
      }
    }),
    icon: createValueResolver((state: AvatarState): AvatarIconStyle => {
      const { icon } = resolve({ size: state.size, color: state.color })

      return {
        size: icon.size,
        strokeWidth: icon.strokeWidth,
        color: icon.color,
      }
    }),
    withStatus: {
      container: createStyleResolver((state: AvatarWithStatusState): AvatarWithStatusContainerStyle => {
        const { container } = resolve({ size: state.size }).withStatus

        return {
          ...container,
          minWidth: container.width,
          maxWidth: container.width,
          minHeight: container.height,
          maxHeight: container.height,
        }
      }),
      statusDot: createStyleResolver((state: AvatarWithStatusState): AvatarStatusDotStyle => ({
        ...resolve({ size: state.size, status: state.status }).withStatus.statusDot,
      })),
    },
    withLabel: {
      container: createStyleResolver((state: AvatarWithLabelState): AvatarWithLabelContainerStyle => ({
        ...resolve({ size: state.size }).withLabel.container,
      })),
      text: createStyleResolver((state: AvatarWithLabelState): AvatarWithLabelTextStyle => {
        const { text } = resolve({ size: state.size }).withLabel

        return {
          ...toTextStyle(text),
          flexShrink: text.flexShrink,
        }
      }),
    },
    group: {
      container: createStyleResolver((state: AvatarGroupState): AvatarGroupContainerStyle => ({
        ...resolve({ size: state.size, groupCount: state.count }).group.container,
      })),
      stack: createStyleResolver((state: AvatarGroupState): AvatarGroupStackStyle => {
        const { stack } = resolve({ size: state.size, groupCount: state.count }).group

        return {
          ...stack,
          minWidth: stack.width,
          maxWidth: stack.width,
          minHeight: stack.height,
          maxHeight: stack.height,
        }
      }),
      more: createStyleResolver((state: AvatarGroupState): AvatarGroupMoreStyle => ({
        ...resolve({ size: state.size, groupCount: state.count }).group.more,
      })),
    },
  }
}
