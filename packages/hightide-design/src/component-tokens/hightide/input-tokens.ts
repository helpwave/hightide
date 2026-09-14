import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { hightideShadow } from '../../primitive-tokens/hightide/shadow'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
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
  container: ResolvableContainerTokens<InputState, InputConfig>,
  stateLayer: ResolvableContainerTokens<InputState, InputConfig>,
  text: ResolvableTextStyleTokens<InputState, InputConfig>,
  placeholder: ResolvableTextStyleTokens<InputState, InputConfig>,
  icon: ResolvableIconTokens<InputState, InputConfig>,
}, ComponentTokens<InputState, InputConfig>>

export type InputTokenResolver = ComponentTokenResolver<
  InputComponentResolverProps,
  InputTokens
>

export type InputParams = AssertAssignable<{
  colors: {
    background: ColorToken,
    foreground: ColorToken,
    color: ColorToken,
    tint: ColorToken,
    accent: ColorToken,
    disabledForeground: ColorToken,
  },
  numbers: {
    size: NumberToken,
    borderRadius: NumberToken,
    borderWidth: NumberToken,
    inset: NumberToken,
    horizontalContentPadding: NumberToken,
    iconSize: NumberToken,
    iconStrokeWidth: NumberToken,
    fontSize: NumberToken,
    fontWeight: NumberToken,
    lineHeight: NumberToken,
  },
}, HightideResolverParams>
export type InputTokenContext = HightideTokenPathProvider<InputParams>

export const inputTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<InputTokenContext>('params.colors.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.6)),
      ]
    ),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderWidth') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorRef<InputTokenContext>('params.colors.color') }),
    }),
    outline: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<InputTokenContext>('theme.focusOutline.width'),
      offset: TokenBuilder.numberRef<InputTokenContext>('theme.focusOutline.offset'),
      style: TokenBuilder.outlineStyleRef<InputTokenContext>('theme.focusOutline.style'),
      color: TokenBuilder.colorRef<InputTokenContext>('params.colors.accent'),
    }),
    shadow: TokenBuilder.stateful(
      undefined,
      [
        TokenBuilder.whenState(['hasFocusShadow'], {
          x: hightideShadow.layout.basic.md.x,
          y: hightideShadow.layout.basic.md.y,
          blur: hightideShadow.layout.basic.md.blur,
          spread: hightideShadow.layout.basic.md.spread,
          color: TokenBuilder.colorOpacity(
            TokenBuilder.colorRef<InputTokenContext>('params.colors.color'),
            TokenBuilder.number(0.7)
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
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  stateLayer: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<InputTokenContext>('params.colors.tint')),
    position: TokenBuilder.stateful({
      type: 'absolute',
      top: TokenBuilder.number(0),
      right: TokenBuilder.number(0),
      bottom: TokenBuilder.number(0),
      left: TokenBuilder.number(0),
      zIndex: TokenBuilder.number(20),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<InputTokenContext>('params.numbers.borderRadius') }),
  },
  text: {
    kind: 'textStyle' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<InputTokenContext>('params.colors.foreground')),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontWeight')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<InputTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.lineHeight')),
  },
  placeholder: {
    kind: 'textStyle' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<InputTokenContext>('params.colors.disabledForeground')),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.fontWeight')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<InputTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.lineHeight')),
  },
  icon: {
    kind: 'icon' as const,
    size: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<InputTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<InputTokenContext>('params.colors.foreground')),
  },
} as const
