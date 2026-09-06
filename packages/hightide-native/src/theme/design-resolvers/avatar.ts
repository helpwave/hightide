import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  avatarGroupMaxShown,
  avatarGroupTokens,
  avatarTokens,
  avatarWithStatusTokens,
  type AvatarGroupTokenResolver,
  type AvatarStatus,
  type AvatarTokenResolver,
  type AvatarTokens,
  type AvatarWithStatusTokenResolver,
  type AvatarWithStatusTokens,
  type ContainerTokens,
  type TextStyleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import { iconTokenResolver } from './icon'

type AvatarTokenState = 'grouped'

type AvatarParams = {
  color: ColorToken,
  onColor: ColorToken,
  dimension: number,
  iconSize: number,
  iconStrokeWidth: number,
}

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

  return resolveTokenConfig<AvatarTokens>(
    avatarTokens,
    states,
    {
      theme: themeTokens,
      params: {
        color: colorPair.color,
        onColor: colorPair.onColor,
        dimension: themeTokens.icongraphy.sizes[size],
        iconSize: iconTokens.size ?? themeTokens.icongraphy.sizes[size],
        iconStrokeWidth: iconTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
      } satisfies AvatarParams,
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
  const resolved = resolveTokenConfig<Pick<AvatarWithStatusTokens, 'statusDot'>>(
    avatarWithStatusTokens,
    new Set<AvatarWithStatusTokenState>([status]),
    {
      theme: themeTokens,
      params: {
        dimension: themeTokens.icongraphy.sizes[size],
      },
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

type AvatarGroupParams = {
  dimension: number,
  visibleCount: number,
}

export const avatarGroupTokenResolver: AvatarGroupTokenResolver = ({
  themeTokens,
  config,
  overrides,
}) => {
  const size = overrides?.size ?? 'md'
  const dimension = themeTokens.icongraphy.sizes[size]
  const visibleCount = Math.min(config.groupCount ?? avatarGroupMaxShown, avatarGroupMaxShown)
  const resolved = resolveTokenConfig<{
    container: ContainerTokens,
    avatarStack: ContainerTokens,
    text: TextStyleTokens,
    avatarOverrideContainer: ContainerTokens,
  }>(
    avatarGroupTokens,
    new Set(),
    {
      theme: themeTokens,
      params: {
        dimension,
        visibleCount,
      } satisfies AvatarGroupParams,
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
