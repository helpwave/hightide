import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'
import { createIconSizeTokens } from './icon-tokens'

export const avatarStatuses = [
  'online',
  'offline',
  'busy',
  'away',
  'unknown',
] as const

export type AvatarStatus = typeof avatarStatuses[number]

export const avatarGroupOverlap = 0.5
export const avatarGroupMaxShown = 5

export type AvatarState = {
  status?: AvatarStatus,
}

export type AvatarComponentResolverProps = {
  config: {
    isGrouped?: boolean,
    groupIndex?: number,
    groupCount?: number,
  },
  overrides: {
    color?: ColorPairToken,
    size?: ComponentSize,
  },
  state: AvatarState,
}

export type AvatarShadowTokens = {
  color: ColorToken,
  offsetX: number,
  offsetY: number,
  blur: number,
  elevation: number,
}

export type AvatarContainerTokens = {
  position: 'absolute' | 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: number,
  height: number,
  padding: number,
  borderRadius: number,
  backgroundColor: ColorToken,
  overflow: 'hidden',
  left?: number,
  zIndex?: number,
  shadow?: AvatarShadowTokens,
}

export type AvatarImageTokens = {
  position: 'absolute',
  left: number,
  top: number,
  width: number,
  height: number,
  borderRadius: number,
}

export type AvatarTextTokens = TextStyleTokens & {
  textAlign: 'center',
}

export type AvatarIconTokens = {
  size: number,
  strokeWidth: number,
  color: ColorToken,
}

export type AvatarStatusDotTokens = {
  position: 'absolute',
  right: number,
  bottom: number,
  zIndex: number,
  width: number,
  height: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorToken,
  backgroundColor: ColorToken,
}

export type AvatarWithStatusContainerTokens = {
  position: 'relative',
  alignSelf: 'flex-start',
  width: number,
  height: number,
}

export type AvatarWithLabelContainerTokens = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: number,
}

export type AvatarWithLabelTextTokens = TextStyleTokens & {
  flexShrink: number,
}

export type AvatarGroupContainerTokens = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: number,
  height: number,
}

export type AvatarGroupStackTokens = {
  position: 'relative',
  width: number,
  height: number,
}

export type AvatarGroupMoreTokens = {
  fontSize: number,
  color: ColorToken,
  flexShrink: number,
}

export type AvatarTokens = {
  container: AvatarContainerTokens,
  image: AvatarImageTokens,
  text: AvatarTextTokens,
  icon: AvatarIconTokens,
  withStatus: {
    container: AvatarWithStatusContainerTokens,
    statusDot: AvatarStatusDotTokens,
  },
  withLabel: {
    container: AvatarWithLabelContainerTokens,
    text: AvatarWithLabelTextTokens,
  },
  group: {
    container: AvatarGroupContainerTokens,
    stack: AvatarGroupStackTokens,
    more: AvatarGroupMoreTokens,
    overlap: number,
    maxShown: number,
  },
}

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

export type AvatarTokenResolver = ComponentTokenResolver<
  AvatarComponentResolverProps,
  AvatarTokens
>

export const avatarTokenResolver: AvatarTokenResolver = ({ themeTokens, config, overrides, state }) => {
  const size = overrides.size ?? 'md'
  const status = state.status ?? 'unknown'
  const groupIndex = config.groupIndex ?? 0
  const { color, spacing, borders, typography, elevation } = themeTokens
  const colorPair = overrides.color ?? color.primary
  const layout = createElementLayoutTokens(themeTokens).insideControl[size]
  const iconTokens = createIconSizeTokens(themeTokens)[size]
  const dimension = layout.size
  const borderRadius = dimension / 2
  const statusDotSize = Math.round(dimension / 10 * 4)
  const raised = elevation.level1
  const gap = spacing.sm
  const visibleCount = Math.min(config.groupCount ?? avatarGroupMaxShown, avatarGroupMaxShown)
  const stackWidth = dimension * (avatarGroupOverlap * Math.max(visibleCount - 1, 0) + 1)

  return {
    container: {
      position: config.isGrouped ? 'absolute' : 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      padding: layout.inset,
      borderRadius,
      backgroundColor: colorPair.color,
      overflow: 'hidden',
      ...(config.isGrouped ? {
        left: groupIndex * dimension * avatarGroupOverlap,
        zIndex: avatarGroupMaxShown - groupIndex,
        shadow: {
          color: raised.color,
          offsetX: raised.x,
          offsetY: raised.y,
          blur: raised.blur,
          elevation: raised.blur,
        },
      } : {}),
    },
    image: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: dimension,
      height: dimension,
      borderRadius,
    },
    text: {
      ...typography.label.sm,
      fontWeight: typography.fontWeights.bold,
      color: colorPair.onColor,
      textAlign: 'center',
    },
    icon: {
      size: iconTokens.size,
      strokeWidth: iconTokens.strokeWidth,
      color: colorPair.onColor,
    },
    withStatus: {
      container: {
        position: 'relative',
        alignSelf: 'flex-start',
        width: dimension,
        height: dimension,
      },
      statusDot: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
        width: statusDotSize,
        height: statusDotSize,
        borderRadius: statusDotSize / 2,
        borderWidth: borders.borderWidths.thin,
        borderColor: color.background.color,
        backgroundColor: statusColors(themeTokens)[status],
      },
    },
    withLabel: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap,
      },
      text: {
        ...typography.body.md,
        color: color.background.onColor,
        flexShrink: 1,
      },
    },
    group: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap,
        height: dimension,
      },
      stack: {
        position: 'relative',
        width: stackWidth,
        height: dimension,
      },
      more: {
        fontSize: dimension * 2 / 3,
        color: color.background.onColor,
        flexShrink: 1,
      },
      overlap: avatarGroupOverlap,
      maxShown: avatarGroupMaxShown,
    },
  }
}
