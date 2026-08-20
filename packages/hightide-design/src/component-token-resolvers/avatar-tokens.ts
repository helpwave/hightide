import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { iconTokenResolver, type IconTokens } from './icon-tokens'

export const avatarStatuses = [
  'online',
  'offline',
  'busy',
  'away',
  'unknown',
] as const

export type AvatarStatus = typeof avatarStatuses[number]

export const avatarSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type AvatarSize = typeof avatarSizes[number]

export const avatarGroupOverlap = 0.5
export const avatarGroupMaxShown = 5

export type AvatarComponentResolverProps = {
  config?: {
    isGrouped?: boolean,
    groupIndex?: number,
  },
  overrides?: {
    color?: ColorPairToken,
    size?: AvatarSize,
  },
}

export type AvatarTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
  icon: IconTokens,
}

export type AvatarOverrideTokens = Partial<AvatarTokens> & {
  overrides?: AvatarComponentResolverProps['overrides'],
}

export type AvatarTokenResolver = ComponentTokenResolver<
  AvatarComponentResolverProps,
  AvatarTokens
>

export const avatarTokenResolver: AvatarTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
  overrides,
}) => {
  const size = overrides?.size ?? 'md'
  const { color, typography, fontWeights, elevation } = themeTokens
  const colorPair = overrides?.color ?? color.primary
  const iconTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size },
  })
  const dimension = themeTokens.icongraphy.sizes[size]
  const borderRadius = dimension / 2
  const raised = elevation.level1

  return {
    container: {
      backgroundColor: colorPair.color,
      size: {
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        maxWidth: dimension,
        maxHeight: dimension,
      },
      shape: {
        borderRadius: {
          type: 'all',
          value: borderRadius,
        },
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      ...(config?.isGrouped ? {
        decoration: {
          shadow: raised,
        },
      } : {}),
    },
    text: {
      ...typography.label.sm,
      fontWeight: fontWeights.bold,
      color: colorPair.onColor,
    },
    icon: {
      size: iconTokens.size,
      strokeWidth: iconTokens.strokeWidth,
      color: colorPair.onColor,
    },
  }
}

export type AvatarWithStatusState = {
  status?: AvatarStatus,
}

export type AvatarWithStatusComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
    size?: AvatarSize,
  },
  state: AvatarWithStatusState,
}

export type AvatarWithStatusTokens = {
  avatarOverride: AvatarOverrideTokens,
  statusDot: ContainerTokens,
}

export type AvatarWithStatusOverrideTokens = Partial<AvatarWithStatusTokens> & {
  overrides?: AvatarWithStatusComponentResolverProps['overrides'],
}

export type AvatarWithStatusTokenResolver = ComponentTokenResolver<
  AvatarWithStatusComponentResolverProps,
  AvatarWithStatusTokens
>

const statusColors = (themeTokens: ThemeTokens): Record<AvatarStatus, ColorToken> => {
  const { color } = themeTokens

  return {
    online: color.positive.color,
    busy: color.negative.color,
    away: color.warning.color,
    offline: color.disabled.color,
    unknown: color.disabled.color,
  }
}

export const avatarWithStatusTokenResolver: AvatarWithStatusTokenResolver = ({
  themeTokens,
  overrides,
  state,
}) => {
  const size = overrides?.size ?? 'md'
  const status = state.status ?? 'unknown'
  const { color, borderWidth } = themeTokens
  const dimension = themeTokens.icongraphy.sizes[size]
  const statusDotSize = Math.round(dimension / 10 * 4)

  return {
    avatarOverride: {
      overrides: {
        color: overrides?.color,
        size,
      },
    },
    statusDot: {
      backgroundColor: statusColors(themeTokens)[status],
      border: {
        width: {
          type: 'all',
          value: borderWidth.thin,
        },
        color: {
          type: 'all',
          value: color.background.color,
        },
      },
      size: {
        width: statusDotSize,
        height: statusDotSize,
      },
      shape: {
        borderRadius: { type: 'all', value: statusDotSize / 2 },
      },
    },
  }
}

export type AvatarGroupComponentResolverProps = {
  config: {
    groupCount?: number,
  },
  overrides?: {
    color?: ColorPairToken,
    size?: AvatarSize,
  },
}

export type AvatarGroupTokens = {
  avatarOverride: AvatarOverrideTokens,
  container: ContainerTokens,
  avatarStack: ContainerTokens,
  text: TextStyleTokens,
}

export type AvatarGroupTokenResolver = ComponentTokenResolver<
  AvatarGroupComponentResolverProps,
  AvatarGroupTokens
>

export const avatarGroupTokenResolver: AvatarGroupTokenResolver = ({
  themeTokens,
  config,
  overrides,
}) => {
  const size = overrides?.size ?? 'md'
  const { color, spacing, elevation } = themeTokens
  const dimension = themeTokens.icongraphy.sizes[size]
  const visibleCount = Math.min(config.groupCount ?? avatarGroupMaxShown, avatarGroupMaxShown)
  const stackWidth = dimension * (avatarGroupOverlap * Math.max(visibleCount - 1, 0) + 1)
  const raised = elevation.level1
  const gap = spacing.sm

  return {
    avatarOverride: {
      overrides: {
        color: overrides?.color,
        size,
      },
      container: {
        decoration: {
          shadow: raised,
        },
      },
    },
    container: {
      size: {
        height: dimension,
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
        gap,
      },
    },
    avatarStack: {
      size: {
        width: stackWidth,
        height: dimension,
      },
    },
    text: {
      fontSize: dimension * 2 / 3,
      color: color.background.onColor,
    },
  }
}
