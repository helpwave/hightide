import type { TokenRefOrValue } from '../../utils'
import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, NumberValueToken, ResolverState } from '../../primitive-tokens'
import type {
  ButtonVariant,
  ComponentSize
} from '../../semantic-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import { elevationTokens } from './elevation-tokens'
import type { ContainerTokens, OutlineTokens, ShadowTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextTokens } from '../text-tokens'
import type { PressableButtonTokenParams } from './pressable-button-params'
import { type PressableStateValue } from './pressable-tokens'
import {
  buttonPadding,
  pressableButtonBorderRadius,
  pressableButtonBorderWidth,
  pressableButtonFontFamily,
  pressableButtonFontSize,
  pressableButtonFontWeight,
  pressableButtonCenteredLayout,
  pressableButtonIconSize,
  pressableButtonIconStrokeWidth,
  pressableButtonLineHeight,
  pressableButtonMinHeightSize
} from './pressable-button-shared-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type ButtonParams = AssertAssignable<PressableButtonTokenParams, HightideResolverParams>
export type ButtonTokenContext = HightideTokenPathProvider<ButtonParams>

export type ButtonState = AssertAssignable<PressableStateValue | 'outlined' | 'elevated', ResolverState>
export type ButtonConfig = HightideResolverConfig

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
  state: ReadonlySet<PressableStateValue>,
}

export type ButtonTokens = AssertAssignable<{
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextTokens,
}, ComponentTokens<ButtonState, ButtonConfig>>

export type ButtonTokenResolver = ComponentTokenResolver<
  ButtonComponentResolverProps,
  ButtonTokens
>

export const buttonTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<ButtonTokenContext>('semantics.color.coloring.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    border: TokenBuilder.stateful(
      {
        width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ value: TokenBuilder.numberValue(TokenBuilder.number(0)) }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)) }),
      },
      [
        TokenBuilder.whenState(['outlined'], {
          width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ value: pressableButtonBorderWidth }),
          color: TokenBuilder.sides<TokenRefOrValue<ColorValueToken>>({ value: TokenBuilder.colorValueRef<ButtonTokenContext>('semantics.color.coloring.border') }),
        }),
      ]
    ),
    outline: TokenBuilder.stateful<OutlineTokens>(
      {
        width: TokenBuilder.numberValue(TokenBuilder.number(0)),
        offset: TokenBuilder.numberValue(TokenBuilder.number(0)),
        style: TokenBuilder.outlineStyle('solid'),
        color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
      },
      [
        TokenBuilder.whenState(['focusVisible'], {
          width: TokenBuilder.numberRef('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef('theme.focusOutline.style'),
          color: TokenBuilder.colorValueRef('semantics.color.coloring.outline'),
        }),
      ]
    ),
    shadow: TokenBuilder.stateful<ShadowTokens>(undefined,
      [
        TokenBuilder.whenState(['elevated'], elevationTokens('level1'), ['hovered']),
        TokenBuilder.whenState(['elevated', 'hovered'], elevationTokens('level2')),
      ]),
    size: pressableButtonMinHeightSize,
    borderRadius: pressableButtonBorderRadius,
    padding: buttonPadding,
    layout: pressableButtonCenteredLayout,
  },
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('semantics.color.stateLayerTint')),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
      right: TokenBuilder.numberValue(TokenBuilder.number(0)),
      bottom: TokenBuilder.numberValue(TokenBuilder.number(0)),
      left: TokenBuilder.numberValue(TokenBuilder.number(0)),
      zIndex: TokenBuilder.numberValue(TokenBuilder.number(20)),
    }),
    borderRadius: pressableButtonBorderRadius,
  },
  icon: {
    type: 'icon',
    size: pressableButtonIconSize,
    strokeWidth: pressableButtonIconStrokeWidth,
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('semantics.color.coloring.foreground')),
  },
  text: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef('semantics.color.coloring.foreground')),
    fontSize: pressableButtonFontSize,
    fontWeight: pressableButtonFontWeight,
    fontFamily: pressableButtonFontFamily,
    lineHeight: pressableButtonLineHeight,
  },
} as const satisfies ButtonTokens
