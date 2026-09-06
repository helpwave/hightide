import type {
  ButtonVariant,
  ComponentSize
} from '../semantic-tokens'
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
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { type PressableState } from './pressable-tokens'

export type ButtonState = PressableState

export const buttonVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly ButtonVariant[]

export type ButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ButtonVariant,
  },
  state: ButtonState,
}

export type ButtonTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type ButtonTokenResolver = ComponentTokenResolver<
  ButtonComponentResolverProps,
  ButtonTokens
>

export const buttonTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful(
      {
        width: {
          type: 'all',
          value: tokenValue(0),
        },
        color: {
          type: 'all',
          value: {
            value: 'transparent',
          },
        },
      },
      [
        whenState(['outlined'], {
          width: {
            type: 'all',
            value: tokenPath('params.layout.borderWidth'),
          },
          color: {
            type: 'all',
            value: tokenPath('params.coloring.border'),
          },
        }),
      ]
    ),
    outline: stateful(
      {
        width: tokenValue(0),
        offset: tokenValue(0),
        style: 'solid',
        color: {
          value: 'transparent',
        },
      },
      [
        whenState(['focusVisible'], {
          width: tokenPath('theme.focusOutline.width'),
          offset: tokenPath('theme.focusOutline.offset'),
          style: tokenPath('theme.focusOutline.style'),
          color: tokenPath('params.coloring.outline'),
        }),
      ]
    ),
    shadow: stateful(undefined,
      [
        whenState(['elevated'], tokenPath('theme.elevation.level1'), ['hovered']),
        whenState(['elevated', 'hovered'], tokenPath('theme.elevation.level2')),
      ]),
    size: stateful({
      minHeight: tokenPath('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    }),
    padding: stateful(
      {
        type: 'physicalAxis',
        vertical: tokenPath('params.layout.inset'),
        horizontal: tokenPath('params.layout.horizontalContentPadding'),
      },
      [
        whenState(['outlined'], {
          type: 'physicalAxis',
          vertical: tokenCalc(
            'max',
            tokenCalc(
              'subtract',
              tokenPath('params.layout.inset'),
              tokenPath('params.layout.borderWidth')
            ),
            tokenValue(0)
          ),
          horizontal: tokenCalc(
            'max',
            tokenCalc(
              'subtract',
              tokenPath('params.layout.horizontalContentPadding'),
              tokenPath('params.layout.borderWidth')
            ),
            tokenValue(0)
          ),
        }),
      ]
    ),
    layout: stateful({
      gap: tokenPath('params.gap'),
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
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
  text: {
    color: stateful(tokenPath('params.coloring.foreground')),
    fontSize: stateful(tokenPath('params.textStyle.fontSize')),
    fontWeight: stateful(tokenPath('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenPath('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenPath('params.textStyle.lineHeight')),
  },
} as const
