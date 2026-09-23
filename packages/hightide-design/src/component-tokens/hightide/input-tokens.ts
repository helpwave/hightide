import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { hightideShadow } from '../../primitive-tokens/hightide/shadow'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens, ShadowTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextTokens } from '../text-tokens'
import {
  pressableStateValues
} from './pressable-tokens'
import type { HightideTokenPathProvider } from './token-context'

export const inputStateValues = [
  ...pressableStateValues,
  'readonly',
  'invalid',
] as const

export type InputStateValue = typeof inputStateValues[number]

export type InputState = AssertAssignable<InputStateValue | 'hasFocusShadow', ResolverState>
export type InputConfig = HightideResolverConfig

export const inputStateValueSet: ReadonlySet<InputStateValue> = new Set(inputStateValues)

export const isInputStateValue = (value: string): value is InputStateValue => (
  inputStateValueSet.has(value as InputStateValue)
)

export const toInputState = (state: ReadonlySet<string>): ReadonlySet<InputStateValue> => {
  const active = new Set<InputStateValue>()
  for (const value of state) {
    if (isInputStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export type InputComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: ReadonlySet<InputStateValue>,
}

export type InputTokens = AssertAssignable<{
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  text: TextTokens,
  placeholder: TextTokens,
  icon: IconTokens,
}, ComponentTokens<InputState, InputConfig>>

export type InputTokenResolver = ComponentTokenResolver<
  InputComponentResolverProps,
  InputTokens
>

export type InputParams = AssertAssignable<{
  colors: {
    background: ColorValueToken,
    foreground: ColorValueToken,
    color: ColorValueToken,
    tint: ColorValueToken,
    accent: ColorValueToken,
    disabledForeground: ColorValueToken,
  },
  numbers: {
    size: NumberValueToken,
    borderRadius: NumberValueToken,
    borderWidth: NumberValueToken,
    inset: NumberValueToken,
    horizontalContentPadding: NumberValueToken,
    iconSize: NumberValueToken,
    iconStrokeWidth: NumberValueToken,
    fontSize: NumberValueToken,
    fontWeight: NumberValueToken,
    lineHeight: NumberValueToken,
  },
}, HightideResolverParams>
export type InputTokenContext = HightideTokenPathProvider<InputParams>

export const inputTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<InputTokenContext>('params.colors.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderWidth') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorValueRef<InputTokenContext>('params.colors.color') }),
    }),
    outline: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<InputTokenContext>('theme.focusOutline.width'),
      offset: TokenBuilder.numberRef<InputTokenContext>('theme.focusOutline.offset'),
      style: TokenBuilder.outlineStyleRef<InputTokenContext>('theme.focusOutline.style'),
      color: TokenBuilder.colorValueRef<InputTokenContext>('params.colors.accent'),
    }),
    shadow: TokenBuilder.stateful<ShadowTokens>(
      undefined,
      [
        TokenBuilder.whenState(['hasFocusShadow'], {
          x: TokenBuilder.numberValue(hightideShadow.layout.basic.md.x),
          y: TokenBuilder.numberValue(hightideShadow.layout.basic.md.y),
          blur: TokenBuilder.numberValue(hightideShadow.layout.basic.md.blur),
          spread: TokenBuilder.numberValue(hightideShadow.layout.basic.md.spread),
          color: TokenBuilder.colorOpacity(
            TokenBuilder.colorValueRef<InputTokenContext>('params.colors.color'),
            TokenBuilder.numberValue(TokenBuilder.number(0.7))
          ),
        }),
      ]
    ),
    size: TokenBuilder.stateful({
      minHeight: TokenBuilder.numberRef<InputTokenContext>('params.numbers.size'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderRadius') }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<InputTokenContext>('params.numbers.inset'), horizontal: TokenBuilder.calc(
      'subtract',
      TokenBuilder.numberRef<InputTokenContext>('params.numbers.horizontalContentPadding'),
      TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderWidth')
    ) }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('start'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<InputTokenContext>('params.colors.tint')),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
      right: TokenBuilder.numberValue(TokenBuilder.number(0)),
      bottom: TokenBuilder.numberValue(TokenBuilder.number(0)),
      left: TokenBuilder.numberValue(TokenBuilder.number(0)),
      zIndex: TokenBuilder.numberValue(TokenBuilder.number(20)),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderRadius') }),
  },
  text: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<InputTokenContext>('params.colors.foreground')),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontWeight')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<InputTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.lineHeight')),
  },
  placeholder: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<InputTokenContext>('params.colors.disabledForeground')),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontWeight')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<InputTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.lineHeight')),
  },
  icon: {
    type: 'icon',
    size: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<InputTokenContext>('params.colors.foreground')),
  },
} as const
