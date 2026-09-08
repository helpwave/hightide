import {
  type ComponentSize,
  type ControlElementLayoutToken,
  type IconButtonVariant
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  createTokenVariable,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { elevationTokens } from './elevation-tokens'
import type { IconTokens } from './icon-tokens'
import type { PressableButtonTokenParams } from './pressable-button-params'
import { type PressableState } from './pressable-tokens'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

export type IconButtonParams = Pick<PressableButtonTokenParams, 'colorPair'> & {
  layout: ControlElementLayoutToken,
  iconSize: number,
  iconStrokeWidth: number,
}
export type IconButtonTokenContext = TokenContext<IconButtonParams>

const tokenVariable = createTokenVariable<IconButtonParams>()

export type IconButtonState = PressableState

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
  state: IconButtonState,
}

export type IconButtonTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
}

export type IconButtonTokenResolver = ComponentTokenResolver<
  IconButtonComponentResolverProps,
  IconButtonTokens
>

export const iconButtonTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('semantics.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    size: stateful({
      width: tokenVariable('params.layout.size'),
      height: tokenVariable('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    shadow: stateful(undefined,
      [
        whenState(['elevated'], elevationTokens('level1'), ['hovered']),
        whenState(['elevated', 'hovered'], elevationTokens('level2')),
      ]),
  },
  stateLayer: {
    backgroundColor: stateful(tokenVariable('semantics.stateLayerTint')),
    position: stateful({
      type: 'absolute',
      top: tokenValue(0),
      right: tokenValue(0),
      bottom: tokenValue(0),
      left: tokenValue(0),
      zIndex: tokenValue(20),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    }),
  },
  icon: {
    size: stateful(tokenVariable('params.iconSize')),
    strokeWidth: stateful(tokenVariable('params.iconStrokeWidth')),
    color: stateful(tokenVariable('semantics.coloring.foreground')),
  },
} as const satisfies ComponentTokenConfig<IconButtonTokens, IconButtonTokenContext>
