import { TokenBuilder } from '../../utils'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import { elevationTokens } from './elevation-tokens'
import type { HightideTokenPathProvider } from './token-context'
import type { AssertAssignable, HightideResolverParams, ColorValueToken, NumberValueToken, ResolverState, HightideResolverConfig } from '../../primitive-tokens'
import type { ComponentTokens } from '..'
import type { ContainerTokens, ShadowTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextTokens } from '../text-tokens'

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


export type AvatarState = AssertAssignable<'isLoading' | 'hasLoaded', ResolverState>
export type AvatarConfig = AssertAssignable<HightideResolverConfig<{
  'avatar-status'?: AvatarStatus,
  'avatar-group'?: '',
}>, HightideResolverConfig>

export type AvatarTokens = AssertAssignable<{
  container: ContainerTokens,
  image: ContainerTokens,
  text: TextTokens,
  icon: IconTokens,
}, ComponentTokens<AvatarState, AvatarConfig>>


export type AvatarOverrideTokens = Partial<AvatarTokens> & {
  overrides?: AvatarComponentResolverProps['overrides'],
}

export type AvatarTokenResolver = ComponentTokenResolver<
  AvatarComponentResolverProps,
  AvatarTokens
>

export type AvatarParams = AssertAssignable<{
  colors: {
    color: ColorValueToken,
    onColor: ColorValueToken,
  },
  numbers: {
    dimension: NumberValueToken,
    iconSize: NumberValueToken,
    iconStrokeWidth: NumberValueToken,
  },
}, HightideResolverParams>
export type AvatarTokenContext = HightideTokenPathProvider<AvatarParams>

export type AvatarWithStatusParams = AssertAssignable<{
  numbers: {
    dimension: NumberValueToken,
  },
}, HightideResolverParams>
export type AvatarWithStatusTokenContext = HightideTokenPathProvider<AvatarWithStatusParams>

export type AvatarGroupParams = AssertAssignable<{
  numbers: {
    dimension: NumberValueToken,
    visibleCount: NumberValueToken,
  },
}, HightideResolverParams>

export type AvatarGroupTokenContext = HightideTokenPathProvider<AvatarGroupParams>

export const avatarTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<AvatarTokenContext>('params.colors.color')),
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      height: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      minWidth: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      minHeight: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      maxWidth: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      maxHeight: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc(
      'divide',
      TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      TokenBuilder.numberValue(TokenBuilder.number(2))
    ) }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
    shadow: TokenBuilder.stateful<ShadowTokens, AvatarState>(undefined,
      [
        TokenBuilder.whenConfig({ 'avatar-group' : '' }, elevationTokens('level1')),
      ]),
  },
  image: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      height: TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc(
      'divide',
      TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.dimension'),
      TokenBuilder.numberValue(TokenBuilder.number(2))
    ) }),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      left: TokenBuilder.numberValue(TokenBuilder.number(0)),
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
    }),
  },
  text: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<AvatarTokenContext>('theme.typography.label.sm.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<AvatarTokenContext>('theme.fontWeights.bold')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<AvatarTokenContext>('theme.typography.label.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<AvatarTokenContext>('theme.typography.label.sm.lineHeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<AvatarTokenContext>('params.colors.onColor')),
  },
  icon: {
    type: 'icon',
    size: TokenBuilder.stateful(TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<AvatarTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<AvatarTokenContext>('params.colors.onColor')),
  },
} as const satisfies AvatarTokens

export type AvatarWithStatusState = AssertAssignable<AvatarStatus, ResolverState>
export type AvatarWithStatusConfig = HightideResolverConfig

export type AvatarWithStatusComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
    size?: AvatarSize,
  },
  state?: {
    status?: AvatarStatus,
  },
}

export type AvatarWithStatusTokens = AssertAssignable<{
  statusDot: ContainerTokens,
}, ComponentTokens<AvatarWithStatusState, AvatarWithStatusConfig>> & {
  avatarOverride: AvatarOverrideTokens,
}

export type AvatarWithStatusOverrideTokens = Partial<AvatarWithStatusTokens> & {
  overrides?: AvatarWithStatusComponentResolverProps['overrides'],
}

export type AvatarWithStatusTokenResolver = ComponentTokenResolver<
  AvatarWithStatusComponentResolverProps,
  AvatarWithStatusTokens
>

const statusDotSize = TokenBuilder.round(
  TokenBuilder.calc('multiply', TokenBuilder.numberRef<AvatarWithStatusTokenContext>('params.numbers.dimension'), TokenBuilder.numberValue(TokenBuilder.number(0.4)))
)

export const avatarWithStatusTokens = {
  statusDot: {
    type: 'container',
    backgroundColor: TokenBuilder.statefulField<ColorValueToken, AvatarStatus>(
      TokenBuilder.colorValueRef('theme.color.disabled.color'),
      [
        TokenBuilder.whenState(['online'], TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.positive.color')),
        TokenBuilder.whenState(['busy'], TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.negative.color')),
        TokenBuilder.whenState(['away'], TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.warning.color')),
        TokenBuilder.whenState(['offline'], TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.disabled.color')),
        TokenBuilder.whenState(['unknown'], TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.disabled.color')),
      ]
    ),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef<AvatarWithStatusTokenContext>('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorValueRef<AvatarWithStatusTokenContext>('theme.color.background.color') }),
    }),
    size: TokenBuilder.stateful({
      width: statusDotSize,
      height: statusDotSize,
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', statusDotSize, TokenBuilder.numberValue(TokenBuilder.number(2))) }),
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

export type AvatarGroupState = ResolverState
export type AvatarGroupConfig = HightideResolverConfig

export type AvatarGroupTokens = AssertAssignable<{
  container: ContainerTokens,
  avatarStack: ContainerTokens,
  text: TextTokens,
}, ComponentTokens<AvatarGroupState, AvatarGroupConfig>> & {
  avatarOverride: AvatarOverrideTokens,
}

export type AvatarGroupTokenResolver = ComponentTokenResolver<
  AvatarGroupComponentResolverProps,
  AvatarGroupTokens
>

const avatarStackWidth = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberRef<AvatarGroupTokenContext>('params.numbers.dimension'),
  TokenBuilder.calc(
    'add',
    TokenBuilder.numberValue(TokenBuilder.number(1)),
    TokenBuilder.calc(
      'multiply',
      TokenBuilder.numberValue(TokenBuilder.number(avatarGroupOverlap)),
      TokenBuilder.calc(
        'max',
        TokenBuilder.calc('subtract', TokenBuilder.numberRef<AvatarGroupTokenContext>('params.numbers.visibleCount'), TokenBuilder.numberValue(TokenBuilder.number(1))),
        TokenBuilder.numberValue(TokenBuilder.number(0))
      )
    )
  )
)

export const avatarGroupTokens = {
  container: {
    type: 'container',
    size: TokenBuilder.stateful({
      height: TokenBuilder.numberRef<AvatarGroupTokenContext>('params.numbers.dimension'),
    }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      gap: TokenBuilder.numberRef<AvatarGroupTokenContext>('theme.spacing.sm'),
    }),
  },
  avatarStack: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: avatarStackWidth,
      height: TokenBuilder.numberRef<AvatarGroupTokenContext>('params.numbers.dimension'),
    }),
  },
  text: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(
      TokenBuilder.calc('multiply', TokenBuilder.numberRef<AvatarGroupTokenContext>('params.numbers.dimension'), TokenBuilder.numberValue(TokenBuilder.number(2 / 3)))
    ),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<AvatarGroupTokenContext>('theme.color.background.onColor')),
  },
  avatarOverrideContainer: {
    type: 'container',
    shadow: TokenBuilder.stateful(elevationTokens('level1')),
  },
} as const
