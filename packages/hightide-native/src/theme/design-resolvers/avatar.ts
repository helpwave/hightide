import { TokenBuilder } from '@helpwave/hightide-design/utils'
import {
  avatarGroupMaxShown,
  avatarGroupTokens,
  avatarTokens,
  avatarWithStatusTokens,
  type AvatarGroupParams,
  type AvatarGroupTokenResolver,
  type AvatarParams,
  type AvatarStatus,
  type AvatarTokenResolver,
  type AvatarTokens,
  type AvatarWithStatusParams,
  type AvatarWithStatusTokenResolver,
  type AvatarWithStatusTokens,
  type ContainerTokens,
  type TextStyleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'
import { iconTokenResolver } from './icon'

type AvatarTokenState = 'grouped'

export const avatarTokenResolver: AvatarTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
  overrides,
}) => {
  const size = overrides?.size ?? 'md'
  const colorPair = overrides?.color ?? themeTokens.color.primary
  const iconTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size },
  })
  const states = new Set<AvatarTokenState>()

  if (config?.isGrouped) {
    states.add('grouped')
  }

  return resolveConfigNode<AvatarTokens>(
    avatarTokens,
    {
      theme: themeTokens,
      params: {
        colors: {
          color: colorPair.color,
          onColor: colorPair.onColor,
        },
        numbers: {
          dimension: themeTokens.icongraphy.sizes[size],
          iconSize: iconTokens.size ?? themeTokens.icongraphy.sizes[size],
          iconStrokeWidth: iconTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
        },
      } satisfies AvatarParams,
      state: states,
    }
  )
}

type AvatarWithStatusTokenState = AvatarStatus

export const avatarWithStatusTokenResolver: AvatarWithStatusTokenResolver = ({
  themeTokens,
  overrides,
  state,
}) => {
  const size = overrides?.size ?? 'md'
  const status = state.status ?? 'unknown'
  const resolved = resolveConfigNode<Pick<AvatarWithStatusTokens, 'statusDot'>>(
    avatarWithStatusTokens,
    {
      theme: themeTokens,
      params: {
        numbers: {
          dimension: themeTokens.icongraphy.sizes[size],
        },
      } satisfies AvatarWithStatusParams,
      state: new Set<AvatarWithStatusTokenState>([status]),
    }
  )

  return {
    avatarOverride: {
      overrides: {
        color: overrides?.color,
        size,
      },
    },
    statusDot: resolved.statusDot,
  }
}

export const avatarGroupTokenResolver: AvatarGroupTokenResolver = ({
  themeTokens,
  config,
  overrides,
}) => {
  const size = overrides?.size ?? 'md'
  const dimension = themeTokens.icongraphy.sizes[size]
  const visibleCount = Math.min(config.groupCount ?? avatarGroupMaxShown, avatarGroupMaxShown)
  const resolved = resolveConfigNode<{
    container: ContainerTokens,
    avatarStack: ContainerTokens,
    text: TextStyleTokens,
    avatarOverrideContainer: ContainerTokens,
  }>(
    avatarGroupTokens,
    {
      theme: themeTokens,
      params: {
        numbers: {
          dimension,
          visibleCount: TokenBuilder.number(visibleCount),
        },
      } satisfies AvatarGroupParams,
      state: new Set(),
    }
  )

  return {
    avatarOverride: {
      overrides: {
        color: overrides?.color,
        size,
      },
      container: resolved.avatarOverrideContainer,
    },
    container: resolved.container,
    avatarStack: resolved.avatarStack,
    text: resolved.text,
  }
}
