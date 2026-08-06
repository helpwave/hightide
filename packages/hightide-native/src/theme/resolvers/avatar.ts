import type {
  ColorPairToken,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'

import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
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
    container: createStyleResolver((state: AvatarState): AvatarStyle => {
      const tokens = resolve({
        size: state.size,
        isGrouped: state.isGrouped,
        groupIndex: state.groupIndex,
        color: state.color,
      })
      const { container } = tokens
      const width = container.size?.width
      const overlap = tokens.group.overlap
      const maxShown = tokens.group.maxShown
      const groupIndex = state.groupIndex ?? 0

      return {
        ...toContainerStyle(container),
        position: state.isGrouped ? 'absolute' : 'relative',
        overflow: 'hidden',
        ...(state.isGrouped && width !== undefined ? {
          left: groupIndex * width * overlap,
          zIndex: maxShown - groupIndex,
        } : {}),
      }
    }),
    image: createStyleResolver((state: AvatarState): AvatarImageStyle => {
      const { container } = resolve({ size: state.size, color: state.color })
      const width = container.size?.width
      const height = container.size?.height

      return {
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: container.shape?.borderRadius,
      }
    }),
    text: createStyleResolver((state: AvatarState): AvatarTextStyle => ({
      ...toTextStyle(resolve({ size: state.size, color: state.color }).text),
      textAlign: 'center',
    })),
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
        const width = container.size?.width
        const height = container.size?.height

        return {
          ...toContainerStyle(container),
          position: 'relative',
          alignSelf: 'flex-start',
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
        }
      }),
      statusDot: createStyleResolver((state: AvatarWithStatusState): AvatarStatusDotStyle => ({
        ...toContainerStyle(resolve({ size: state.size, status: state.status }).withStatus.statusDot),
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
      })),
    },
    withLabel: {
      container: createStyleResolver((state: AvatarWithLabelState): AvatarWithLabelContainerStyle => ({
        ...toContainerStyle(resolve({ size: state.size }).withLabel.container),
        flexDirection: 'row',
        alignItems: 'center',
      })),
      text: createStyleResolver((state: AvatarWithLabelState): AvatarWithLabelTextStyle => {
        const { text } = resolve({ size: state.size }).withLabel

        return {
          ...toTextStyle(text),
          flexShrink: 1,
        }
      }),
    },
    group: {
      container: createStyleResolver((state: AvatarGroupState): AvatarGroupContainerStyle => ({
        ...toContainerStyle(resolve({ size: state.size, groupCount: state.count }).group.container),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
      })),
      stack: createStyleResolver((state: AvatarGroupState): AvatarGroupStackStyle => {
        const { stack } = resolve({ size: state.size, groupCount: state.count }).group
        const width = stack.size?.width
        const height = stack.size?.height

        return {
          ...toContainerStyle(stack),
          position: 'relative',
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
        }
      }),
      more: createStyleResolver((state: AvatarGroupState): AvatarGroupMoreStyle => ({
        ...toTextStyle(resolve({ size: state.size, groupCount: state.count }).group.moreText),
        flexShrink: 1,
      })),
    },
  }
}
