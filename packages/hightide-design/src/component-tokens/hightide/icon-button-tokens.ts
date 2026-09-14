import { TokenBuilder } from '../../utils'
import {
  type ComponentSize,
  type IconButtonVariant
} from '../../semantic-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import { elevationTokens } from './elevation-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { AssertAssignable, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { type PressableStateValue } from './pressable-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type IconButtonParams = AssertAssignable<{
  numbers: {
    size: NumberToken,
    borderRadius: NumberToken,
    iconSize: NumberToken,
    iconStrokeWidth: NumberToken,
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
  container: ResolvableContainerTokens<IconButtonState, IconButtonConfig>,
  stateLayer: ResolvableContainerTokens<IconButtonState, IconButtonConfig>,
  icon: ResolvableIconTokens<IconButtonState, IconButtonConfig>,
}, ComponentTokens<IconButtonState, IconButtonConfig>>

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

export const iconButtonTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<IconButtonTokenContext>('semantics.color.coloring.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.6)),
      ]
    ),
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.size'),
      height: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.size'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.borderRadius') }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    shadow: TokenBuilder.stateful(undefined,
      [
        TokenBuilder.whenState(['elevated'], elevationTokens('level1'), ['hovered']),
        TokenBuilder.whenState(['elevated', 'hovered'], elevationTokens('level2')),
      ]),
  },
  stateLayer: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<IconButtonTokenContext>('semantics.color.stateLayerTint')),
    position: TokenBuilder.stateful({
      type: 'absolute',
      top: TokenBuilder.number(0),
      right: TokenBuilder.number(0),
      bottom: TokenBuilder.number(0),
      left: TokenBuilder.number(0),
      zIndex: TokenBuilder.number(20),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.borderRadius') }),
  },
  icon: {
    kind: 'icon' as const,
    size: TokenBuilder.stateful(TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<IconButtonTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<IconButtonTokenContext>('semantics.color.coloring.foreground')),
  },
} as const
