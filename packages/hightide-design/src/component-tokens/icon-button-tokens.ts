import {
  type ComponentSize,
  type IconButtonVariant
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { type PressableState } from './pressable-tokens'

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
    backgroundColor: stateful(tokenPath('params.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    size: stateful({
      width: tokenPath('params.layout.size'),
      height: tokenPath('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    shadow: stateful(undefined,
      [
        whenState(['elevated'], tokenPath('theme.elevation.level1'), ['hovered']),
        whenState(['elevated', 'hovered'], tokenPath('theme.elevation.level2')),
      ]),
  },
  stateLayer: {
    backgroundColor: stateful(tokenPath('params.tint')),
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
      value: tokenPath('params.layout.borderRadius'),
    }),
  },
  icon: {
    size: stateful(tokenPath('params.iconSize')),
    strokeWidth: stateful(tokenPath('params.iconStrokeWidth')),
    color: stateful(tokenPath('params.coloring.foreground')),
  },
} as const
