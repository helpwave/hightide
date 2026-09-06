import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { IconTokens } from './icon-tokens'

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
  image: ContainerTokens,
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

export const avatarTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.color')),
    size: stateful({
      width: tokenPath('params.dimension'),
      height: tokenPath('params.dimension'),
      minWidth: tokenPath('params.dimension'),
      minHeight: tokenPath('params.dimension'),
      maxWidth: tokenPath('params.dimension'),
      maxHeight: tokenPath('params.dimension'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', tokenPath('params.dimension'), tokenValue(2)),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    shadow: stateful(undefined,
      [
        whenState(['grouped'], tokenPath('theme.elevation.level1')),
      ]),
  },
  image: {
    size: stateful({
      width: tokenPath('params.dimension'),
      height: tokenPath('params.dimension'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', tokenPath('params.dimension'), tokenValue(2)),
    }),
    position: stateful({
      type: 'absolute',
      left: tokenValue(0),
      top: tokenValue(0),
    }),
  },
  text: {
    fontSize: stateful(tokenPath('theme.typography.label.sm.fontSize')),
    fontWeight: stateful(tokenPath('theme.fontWeights.bold')),
    fontFamily: stateful(tokenPath('theme.typography.label.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.label.sm.lineHeight')),
    color: stateful(tokenPath('params.onColor')),
  },
  icon: {
    size: stateful(tokenPath('params.iconSize')),
    strokeWidth: stateful(tokenPath('params.iconStrokeWidth')),
    color: stateful(tokenPath('params.onColor')),
  },
} as const

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

const statusDotSize = tokenCalc(
  'round',
  tokenCalc('multiply', tokenPath('params.dimension'), tokenValue(0.4))
)

export const avatarWithStatusTokens = {
  statusDot: {
    backgroundColor: stateful(
      tokenPath('theme.color.disabled.color'),
      [
        whenState(['online'], tokenPath('theme.color.positive.color')),
        whenState(['busy'], tokenPath('theme.color.negative.color')),
        whenState(['away'], tokenPath('theme.color.warning.color')),
        whenState(['offline'], tokenPath('theme.color.disabled.color')),
        whenState(['unknown'], tokenPath('theme.color.disabled.color')),
      ]
    ),
    border: stateful({
      width: {
        type: 'all',
        value: tokenPath('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: tokenPath('theme.color.background.color'),
      },
    }),
    size: stateful({
      width: statusDotSize,
      height: statusDotSize,
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', statusDotSize, tokenValue(2)),
    }),
  },
} as const

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

const avatarStackWidth = tokenCalc(
  'multiply',
  tokenPath('params.dimension'),
  tokenCalc(
    'add',
    tokenValue(1),
    tokenCalc(
      'multiply',
      tokenValue(avatarGroupOverlap),
      tokenCalc(
        'max',
        tokenCalc('subtract', tokenPath('params.visibleCount'), tokenValue(1)),
        tokenValue(0)
      )
    )
  )
)

export const avatarGroupTokens = {
  container: {
    size: stateful({
      height: tokenPath('params.dimension'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.spacing.sm'),
    }),
  },
  avatarStack: {
    size: stateful({
      width: avatarStackWidth,
      height: tokenPath('params.dimension'),
    }),
  },
  text: {
    fontSize: stateful(
      tokenCalc('multiply', tokenPath('params.dimension'), tokenValue(2 / 3))
    ),
    color: stateful(tokenPath('theme.color.background.onColor')),
  },
  avatarOverrideContainer: {
    shadow: stateful(tokenPath('theme.elevation.level1')),
  },
} as const
