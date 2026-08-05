import type {
  AvatarContainerTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  ColorPairToken,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'

import { toTextStyle } from '../adapters/style-adapters'
import type {
  AvatarGroupContainerStyle,
  AvatarGroupMoreStyle,
  AvatarGroupStackStyle,
  AvatarGroupState,
  AvatarIconStyle,
  AvatarImageStyle,
  AvatarState,
  AvatarStatus,
  AvatarStatusDotStyle,
  AvatarStyle,
  AvatarTextStyle,
  AvatarThemeResolvers,
  AvatarWithLabelContainerStyle,
  AvatarWithLabelState,
  AvatarWithLabelTextStyle,
  AvatarWithStatusContainerStyle,
  AvatarWithStatusState
} from '../types/components/avatar'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toAvatarThemeResolvers: ComponentThemeResolver<AvatarThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
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

  const resolve = (input: {
    size?: ComponentSize,
    color?: ColorPairToken,
    status?: AvatarStatus,
    isGrouped?: boolean,
    groupIndex?: number,
    groupCount?: number,
  } = {}) => componentTokens.avatar({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: {
      isGrouped: input.isGrouped,
      groupIndex: input.groupIndex,
      groupCount: input.groupCount,
    },
    overrides: {
      color: input.color,
      size: input.size,
    },
    state: {
      status: input.status,
    },
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
