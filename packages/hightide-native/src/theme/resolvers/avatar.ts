import {
  avatarGroupMaxShown,
  avatarGroupOverlap,
  type AvatarOverrideTokens,
  type AvatarSize,
  type AvatarTokens,
  type AvatarWithStatusOverrideTokens,
  type AvatarWithStatusTokens
} from '@helpwave/hightide-design/component-token-resolvers'

import type {
  AvatarGroupContainerStyle,
  AvatarGroupStackStyle,
  AvatarGroupState,
  AvatarGroupTextStyle,
  AvatarGroupThemeResolvers,
  AvatarIconStyle,
  AvatarImageStyle,
  AvatarState,
  AvatarStatusDotStyle,
  AvatarStyle,
  AvatarTextStyle,
  AvatarThemeResolvers,
  AvatarWithStatusState,
  AvatarWithStatusThemeResolvers
} from '../types/components/avatar'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

export const toDesignAvatarSize = (size?: AvatarSize | number): AvatarSize => (
  typeof size === 'number' ? 'md' : (size ?? 'md')
)

export const mergeAvatarTokens = (
  base: AvatarTokens,
  override?: AvatarOverrideTokens
): AvatarTokens => ({
  container: {
    ...base.container,
    ...override?.container,
    size: {
      ...base.container.size,
      ...override?.container?.size,
    },
    shape: {
      ...base.container.shape,
      ...override?.container?.shape,
    },
    layout: {
      ...base.container.layout,
      ...override?.container?.layout,
    },
    decoration: {
      ...base.container.decoration,
      ...override?.container?.decoration,
    },
  },
  image: {
    ...base.image,
    ...override?.image,
    size: {
      ...base.image.size,
      ...override?.image?.size,
    },
    shape: {
      ...base.image.shape,
      ...override?.image?.shape,
    },
    layout: {
      ...base.image.layout,
      ...override?.image?.layout,
    },
    decoration: {
      ...base.image.decoration,
      ...override?.image?.decoration,
    },
    position: override?.image?.position ?? base.image.position,
    transform: override?.image?.transform ?? base.image.transform,
  },
  text: {
    ...base.text,
    ...override?.text,
  },
  icon: {
    ...base.icon,
    ...override?.icon,
  },
})

export const withNumericAvatarSize = (
  tokens: AvatarTokens,
  size: number
): AvatarTokens => {
  const borderRadius = size / 2

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
    image: {
      ...tokens.image,
      size: {
        width: size,
        height: size,
      },
      shape: {
        ...tokens.image.shape,
        borderRadius: { type: 'all', value: borderRadius },
      },
    },
    icon: {
      ...tokens.icon,
      size,
    },
  }
}

export const createAvatarStyleResolvers = (
  resolveTokens: (state: AvatarState) => AvatarTokens
): AvatarThemeResolvers => ({
  container: createStyleResolver((state: AvatarState): AvatarStyle => {
    const { container } = resolveTokens(state)
    const width = typeof container.size?.width === 'number'
      ? container.size.width
      : 0
    const groupIndex = state.groupIndex ?? 0

    return {
      ...StyleAdapterUtils.container(container),
      position: state.isGrouped ? 'absolute' : 'relative',
      overflow: 'hidden',
      ...(state.isGrouped ? {
        left: groupIndex * width * avatarGroupOverlap,
        zIndex: avatarGroupMaxShown - groupIndex,
      } : {}),
    }
  }),
  image: createStyleResolver((state: AvatarState): AvatarImageStyle => (
    StyleAdapterUtils.container(resolveTokens(state).image) as AvatarImageStyle
  )),
  text: createStyleResolver((state: AvatarState): AvatarTextStyle => (
    StyleAdapterUtils.text(resolveTokens(state).text)
  )),
  icon: createStyleResolver((state: AvatarState): AvatarIconStyle => (
    StyleAdapterUtils.icon(resolveTokens(state).icon)
  )),
})

export const toAvatarThemeResolvers: ComponentThemeResolver<AvatarThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolveTokens = (state: AvatarState): AvatarTokens => {
    const tokens = componentTokens.avatar({
      themeTokens,
      semanticResolvers: semanticTokens,
      config: {
        isGrouped: state.isGrouped,
        groupIndex: state.groupIndex,
      },
      overrides: {
        color: state.color,
        size: toDesignAvatarSize(state.size),
      },
    })

    if (typeof state.size === 'number') {
      return withNumericAvatarSize(tokens, state.size)
    }

    return tokens
  }

  return createAvatarStyleResolvers(resolveTokens)
}

export const createAvatarWithStatusThemeResolvers = (
  resolve: (state: AvatarWithStatusState) => AvatarWithStatusTokens,
  context: {
    themeTokens: Parameters<ComponentThemeResolver<AvatarWithStatusThemeResolvers>>[0]['themeTokens'],
    semanticTokens: Parameters<ComponentThemeResolver<AvatarWithStatusThemeResolvers>>[0]['semanticTokens'],
    componentTokens: Parameters<ComponentThemeResolver<AvatarWithStatusThemeResolvers>>[0]['componentTokens'],
  }
): AvatarWithStatusThemeResolvers => {
  const { themeTokens, semanticTokens, componentTokens } = context

  return {
    avatar: createStyleResolver((state: AvatarWithStatusState) => {
      const { avatarOverride } = resolve(state)

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
              color: avatarState.color ?? avatarOverride.overrides?.color,
              size: toDesignAvatarSize(avatarState.size ?? avatarOverride.overrides?.size),
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

      return createAvatarStyleResolvers(resolveTokens)
    }),
    statusDot: createStyleResolver((state: AvatarWithStatusState): AvatarStatusDotStyle => {
      const tokens = resolve(state)
      const statusDot = tokens.statusDot
      const size = typeof state.size === 'number'
        ? Math.round(state.size / 10 * 4)
        : undefined

      return {
        ...StyleAdapterUtils.container(
          size === undefined
            ? statusDot
            : {
              ...statusDot,
              size: {
                width: size,
                height: size,
              },
              shape: {
                ...statusDot.shape,
                borderRadius: { type: 'all', value: size / 2 },
              },
            }
        ),
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
      }
    }),
  }
}

export const mergeAvatarWithStatusTokens = (
  base: AvatarWithStatusTokens,
  override?: AvatarWithStatusOverrideTokens
): AvatarWithStatusTokens => ({
  avatarOverride: {
    ...base.avatarOverride,
    ...override?.avatarOverride,
    overrides: {
      ...base.avatarOverride.overrides,
      ...override?.overrides,
      ...override?.avatarOverride?.overrides,
    },
  },
  statusDot: {
    ...base.statusDot,
    ...override?.statusDot,
    size: {
      ...base.statusDot.size,
      ...override?.statusDot?.size,
    },
    shape: {
      ...base.statusDot.shape,
      ...override?.statusDot?.shape,
    },
    border: {
      ...base.statusDot.border,
      ...override?.statusDot?.border,
    },
  },
})

export const toAvatarWithStatusThemeResolvers: ComponentThemeResolver<
  AvatarWithStatusThemeResolvers
> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: AvatarWithStatusState = {}) => componentTokens.avatarWithStatus({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
      size: toDesignAvatarSize(state.size),
    },
    state: {
      status: state.status,
    },
  })

  return createAvatarWithStatusThemeResolvers(resolve, {
    themeTokens,
    semanticTokens,
    componentTokens,
  })
}

export const toAvatarGroupThemeResolvers: ComponentThemeResolver<
  AvatarGroupThemeResolvers
> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: AvatarGroupState = {}) => componentTokens.avatarGroup({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: {
      groupCount: state.count,
    },
    overrides: {
      color: state.color,
      size: toDesignAvatarSize(state.size),
    },
  })

  return {
    avatar: createStyleResolver((state: AvatarGroupState) => {
      const { avatarOverride } = resolve(state)

      const resolveTokens = (avatarState: AvatarState): AvatarTokens => {
        const tokens = mergeAvatarTokens(
          componentTokens.avatar({
            themeTokens,
            semanticResolvers: semanticTokens,
            config: {
              isGrouped: true,
              groupIndex: avatarState.groupIndex,
            },
            overrides: {
              color: avatarState.color ?? avatarOverride.overrides?.color,
              size: toDesignAvatarSize(avatarState.size ?? avatarOverride.overrides?.size),
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

      return createAvatarStyleResolvers(resolveTokens)
    }),
    container: createStyleResolver((state: AvatarGroupState): AvatarGroupContainerStyle => {
      const tokens = resolve(state)
      let container = tokens.container

      if (typeof state.size === 'number') {
        container = {
          ...container,
          size: {
            ...container.size,
            height: state.size,
          },
        }
      }

      return StyleAdapterUtils.container(container)
    }),
    avatarStack: createStyleResolver((state: AvatarGroupState): AvatarGroupStackStyle => {
      const tokens = resolve(state)
      let avatarStack = tokens.avatarStack

      if (typeof state.size === 'number') {
        const visibleCount = Math.min(
          avatarGroupMaxShown,
          state.count ?? avatarGroupMaxShown
        )
        const stackWidth = state.size * (avatarGroupOverlap * Math.max(visibleCount - 1, 0) + 1)
        avatarStack = {
          ...avatarStack,
          size: {
            width: stackWidth,
            height: state.size,
          },
        }
      }

      const width = avatarStack.size?.width
      const height = avatarStack.size?.height

      return {
        ...StyleAdapterUtils.container(avatarStack),
        position: 'relative',
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
      }
    }),
    text: createStyleResolver((state: AvatarGroupState): AvatarGroupTextStyle => {
      const { text } = resolve(state)

      return {
        ...StyleAdapterUtils.text(
          typeof state.size === 'number'
            ? {
              ...text,
              fontSize: state.size * 2 / 3,
            }
            : text
        ),
        flexShrink: 1,
      }
    }),
  }
}
