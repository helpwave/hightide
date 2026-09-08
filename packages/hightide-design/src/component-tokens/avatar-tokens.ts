import type { ColorToken } from '../primitive-tokens/color'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue,
  whenState,
  statefulField
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { elevationTokens } from './elevation-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { IconTokens } from './icon-tokens'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

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

export type AvatarParams = {
  color: ColorToken,
  onColor: ColorToken,
  dimension: number,
  iconSize: number,
  iconStrokeWidth: number,
}
export type AvatarTokenContext = TokenContext<AvatarParams>

export type AvatarWithStatusParams = {
  dimension: number,
}
export type AvatarWithStatusTokenContext = TokenContext<AvatarWithStatusParams>

export type AvatarGroupParams = {
  dimension: number,
  visibleCount: number,
}
export type AvatarGroupTokenContext = TokenContext<AvatarGroupParams>

const tokenVariable = createTokenVariable<AvatarParams & AvatarGroupParams>()

export const avatarTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('params.color')),
    size: stateful({
      width: tokenVariable('params.dimension'),
      height: tokenVariable('params.dimension'),
      minWidth: tokenVariable('params.dimension'),
      minHeight: tokenVariable('params.dimension'),
      maxWidth: tokenVariable('params.dimension'),
      maxHeight: tokenVariable('params.dimension'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', tokenVariable('params.dimension'), tokenValue(2)),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    shadow: stateful(undefined,
      [
        whenState(['grouped'], elevationTokens('level1')),
      ]),
  },
  image: {
    size: stateful({
      width: tokenVariable('params.dimension'),
      height: tokenVariable('params.dimension'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', tokenVariable('params.dimension'), tokenValue(2)),
    }),
    position: stateful({
      type: 'absolute',
      left: tokenValue(0),
      top: tokenValue(0),
    }),
  },
  text: {
    fontSize: stateful(tokenVariable('theme.typography.label.sm.fontSize')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.bold')),
    fontFamily: stateful(tokenVariable('theme.typography.label.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.label.sm.lineHeight')),
    color: stateful(tokenVariable('params.onColor')),
  },
  icon: {
    size: stateful(tokenVariable('params.iconSize')),
    strokeWidth: stateful(tokenVariable('params.iconStrokeWidth')),
    color: stateful(tokenVariable('params.onColor')),
  },
} as const satisfies ComponentTokenConfig<AvatarTokens, AvatarTokenContext>

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
  tokenCalc('multiply', tokenVariable('params.dimension'), tokenValue(0.4))
)

export const avatarWithStatusTokens = {
  statusDot: {
    backgroundColor: statefulField<ColorToken, AvatarWithStatusTokenContext>(
      tokenVariable('theme.color.disabled.color'),
      [
        whenState(['online'], tokenVariable('theme.color.positive.color')),
        whenState(['busy'], tokenVariable('theme.color.negative.color')),
        whenState(['away'], tokenVariable('theme.color.warning.color')),
        whenState(['offline'], tokenVariable('theme.color.disabled.color')),
        whenState(['unknown'], tokenVariable('theme.color.disabled.color')),
      ]
    ),
    border: stateful({
      width: {
        type: 'all',
        value: tokenVariable('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: tokenVariable('theme.color.background.color'),
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
} as const satisfies ComponentTokenConfig<AvatarWithStatusTokens, AvatarWithStatusTokenContext>

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
  tokenVariable('params.dimension'),
  tokenCalc(
    'add',
    tokenValue(1),
    tokenCalc(
      'multiply',
      tokenValue(avatarGroupOverlap),
      tokenCalc(
        'max',
        tokenCalc('subtract', tokenVariable('params.visibleCount'), tokenValue(1)),
        tokenValue(0)
      )
    )
  )
)

export const avatarGroupTokens = {
  container: {
    size: stateful({
      height: tokenVariable('params.dimension'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenVariable('theme.spacing.sm'),
    }),
  },
  avatarStack: {
    size: stateful({
      width: avatarStackWidth,
      height: tokenVariable('params.dimension'),
    }),
  },
  text: {
    fontSize: stateful(
      tokenCalc('multiply', tokenVariable('params.dimension'), tokenValue(2 / 3))
    ),
    color: stateful(tokenVariable('theme.color.background.onColor')),
  },
  avatarOverrideContainer: {
    shadow: stateful(elevationTokens('level1')),
  },
} as const satisfies ComponentTokenConfig<AvatarGroupTokens & {
  avatarOverrideContainer: ContainerTokens
}, AvatarGroupTokenContext>
