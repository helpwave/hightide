import { TokenBuilder } from '../../utils'
import {
  type ComponentSize,
  type IconButtonVariant
} from '../../semantic-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import { elevationTokens } from './elevation-tokens'
import type { ContainerTokens, ShadowTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { AssertAssignable, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { type PressableStateValue } from './pressable-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type IconButtonParams = AssertAssignable<{
  numbers: {
    size: NumberValueToken,
    borderRadius: NumberValueToken,
    iconSize: NumberValueToken,
    iconStrokeWidth: NumberValueToken,
  },
}, HightideResolverParams>
export type IconButtonTokenContext = HightideTokenPathProvider<IconButtonParams>

export type IconButtonState = AssertAssignable<PressableStateValue | 'elevated', ResolverState>
export type IconButtonConfig = HightideResolverConfig

export const iconButtonVariants = [
  'elevated',
  'filled',
  'tonal',
  'foreground',
] as const satisfies readonly IconButtonVariant[]

export type IconButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: IconButtonVariant,
  },
  state: ReadonlySet<PressableStateValue>,
}

export type IconButtonTokens = AssertAssignable<{
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
}, ComponentTokens<IconButtonConfig>>

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

export const iconButtonTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<IconButtonTokenContext>('semantics.color.coloring.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.size'),
      height: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.size'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.borderRadius') }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
    shadow: TokenBuilder.stateful<ShadowTokens>(undefined,
      [
        TokenBuilder.whenState(['elevated'], elevationTokens('level1'), ['hovered']),
        TokenBuilder.whenState(['elevated', 'hovered'], elevationTokens('level2')),
      ]),
  },
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<IconButtonTokenContext>('semantics.color.stateLayerTint')),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
      right: TokenBuilder.numberValue(TokenBuilder.number(0)),
      bottom: TokenBuilder.numberValue(TokenBuilder.number(0)),
      left: TokenBuilder.numberValue(TokenBuilder.number(0)),
      zIndex: TokenBuilder.numberValue(TokenBuilder.number(20)),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.borderRadius') }),
  },
  icon: {
    type: 'icon',
    size: TokenBuilder.stateful(TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<IconButtonTokenContext>('semantics.color.coloring.foreground')),
  },
} as const
