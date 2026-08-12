import type {
  ColorPairToken,
  IconSize
} from '@helpwave/hightide-design/theme-tokens'
import {
  avatarGroupMaxShown,
  avatarGroupOverlap,
  type AvatarTokens
} from '@helpwave/hightide-design/component-token-resolvers'

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

const toDesignIconSize = (size?: IconSize | number): IconSize => (
  typeof size === 'number' ? 'md' : (size ?? 'md')
)

const withNumericAvatarSize = (
  tokens: AvatarTokens,
  size: number,
  groupCount?: number
): AvatarTokens => {
  const borderRadius = size / 2
  const statusDotSize = Math.round(size / 10 * 4)
  const visibleCount = Math.min(
    avatarGroupMaxShown,
    groupCount ?? avatarGroupMaxShown
  )
  const stackWidth = size * (avatarGroupOverlap * Math.max(visibleCount - 1, 0) + 1)

  return {
    ...tokens,
    container: {
      ...tokens.container,
      size: {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
      },
      shape: {
        ...tokens.container.shape,
        borderRadius: { type: 'all', value: borderRadius },
      },
    },
    icon: {
      ...tokens.icon,
      size,
    },
    withStatus: {
      container: {
        ...tokens.withStatus.container,
        size: {
          width: size,
          height: size,
        },
      },
      statusDot: {
        ...tokens.withStatus.statusDot,
        size: {
          width: statusDotSize,
          height: statusDotSize,
        },
        shape: {
          ...tokens.withStatus.statusDot.shape,
          borderRadius: { type: 'all', value: statusDotSize / 2 },
        },
      },
    },
    group: {
      ...tokens.group,
      container: {
        ...tokens.group.container,
        size: {
          ...tokens.group.container.size,
          height: size,
        },
      },
      stack: {
        ...tokens.group.stack,
        size: {
          width: stackWidth,
          height: size,
        },
      },
      moreText: {
        ...tokens.group.moreText,
        fontSize: size * 2 / 3,
      },
    },
  }
}

export const toAvatarThemeResolvers: ComponentThemeResolver<AvatarThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (input: {
    size?: IconSize | number,
    color?: ColorPairToken,
    status?: AvatarStatus,
    isGrouped?: boolean,
    groupIndex?: number,
    groupCount?: number,
  } = {}) => {
    const tokens = componentTokens.avatar({
      themeTokens,
      semanticResolvers: semanticTokens,
      config: {
        isGrouped: input.isGrouped,
        groupIndex: input.groupIndex,
        groupCount: input.groupCount,
      },
      overrides: {
        color: input.color,
        size: toDesignIconSize(input.size),
      },
      state: {
        status: input.status,
      },
    })

    if (typeof input.size === 'number') {
      return withNumericAvatarSize(tokens, input.size, input.groupCount)
    }

    return tokens
  }

  return {
    container: createStyleResolver((state: AvatarState): AvatarStyle => {
      const tokens = resolve({
        size: state.size,
        isGrouped: state.isGrouped,
        groupIndex: state.groupIndex,
        color: state.color,
      })
      const { container } = tokens
      const width = typeof container.size?.width === 'number'
        ? container.size.width
        : 0
      const groupIndex = state.groupIndex ?? 0

      return {
        ...toContainerStyle(container),
        position: state.isGrouped ? 'absolute' : 'relative',
        overflow: 'hidden',
        ...(state.isGrouped ? {
          left: groupIndex * width * avatarGroupOverlap,
          zIndex: avatarGroupMaxShown - groupIndex,
        } : {}),
      }
    }),
    image: createStyleResolver((state: AvatarState): AvatarImageStyle => {
      const { container } = resolve({ size: state.size, color: state.color })
      const width = container.size?.width
      const height = container.size?.height
      const borderRadius = container.shape?.borderRadius

      return {
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: borderRadius?.type === 'all'
          ? borderRadius.value
          : undefined,
      }
    }),
    text: createStyleResolver((state: AvatarState): AvatarTextStyle => ({
      ...toTextStyle(resolve({ size: state.size, color: state.color }).text),
      textAlign: 'center',
    })),
    icon: createValueResolver((state: AvatarState): AvatarIconStyle => {
      const { icon } = resolve({ size: state.size, color: state.color })

      return {
        size: icon.size ?? themeTokens.icongraphy.sizes.md,
        strokeWidth: icon.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
        color: icon.color ?? themeTokens.color.primary.onColor,
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
