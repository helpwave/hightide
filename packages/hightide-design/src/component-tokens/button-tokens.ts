import type {
  ButtonVariant,
  ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenValue,
  tokenVariable,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { Resolvable } from './resolvable'
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { type PressableState } from './pressable-tokens'
import {
  buttonPadding,
  pressableButtonBorderRadius,
  pressableButtonBorderWidth,
  pressableButtonFontFamily,
  pressableButtonFontSize,
  pressableButtonFontWeight,
  pressableButtonGap,
  pressableButtonIconSize,
  pressableButtonIconStrokeWidth,
  pressableButtonLineHeight,
  pressableButtonMinHeight
} from './pressable-button-shared-tokens'

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
    backgroundColor: stateful(tokenVariable('semantics.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful<string, Resolvable<NonNullable<ContainerTokens['border']>, string, string>>(
      {
        width: {
          type: 'all',
          value: tokenValue(0),
        },
        color: {
          type: 'all',
          value: {
            value: HexColorUtils.transparent,
          },
        },
      },
      [
        whenState(['outlined'], {
          width: {
            type: 'all',
            value: pressableButtonBorderWidth,
          },
          color: {
            type: 'all',
            value: tokenVariable('semantics.coloring.border'),
          },
        }),
      ]
    ),
    outline: stateful<string, Resolvable<NonNullable<ContainerTokens['outline']>, string, string>>(
      {
        width: tokenValue(0),
        offset: tokenValue(0),
        style: 'solid',
        color: {
          value: HexColorUtils.transparent,
        },
      },
      [
        whenState(['focusVisible'], {
          width: tokenVariable('theme.focusOutline.width'),
          offset: tokenVariable('theme.focusOutline.offset'),
          style: tokenVariable('theme.focusOutline.style'),
          color: tokenVariable('semantics.coloring.outline'),
        }),
      ]
    ),
    shadow: stateful(undefined,
      [
        whenState(['elevated'], tokenVariable('theme.elevation.level1'), ['hovered']),
        whenState(['elevated', 'hovered'], tokenVariable('theme.elevation.level2')),
      ]),
    size: {
      minHeight: pressableButtonMinHeight,
    },
    borderRadius: pressableButtonBorderRadius,
    padding: buttonPadding,
    layout: {
      gap: pressableButtonGap,
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    },
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
    borderRadius: pressableButtonBorderRadius,
  },
  icon: {
    size: pressableButtonIconSize,
    strokeWidth: pressableButtonIconStrokeWidth,
    color: stateful(tokenVariable('semantics.coloring.foreground')),
  },
  text: {
    color: stateful(tokenVariable('semantics.coloring.foreground')),
    fontSize: pressableButtonFontSize,
    fontWeight: pressableButtonFontWeight,
    fontFamily: pressableButtonFontFamily,
    lineHeight: pressableButtonLineHeight,
  },
} as const
