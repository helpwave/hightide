import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { type ComponentSize } from '../../semantic-tokens'
import { HexColorUtils } from '../../utils/hex'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens, OutlineTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import { inputStateValues } from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'

export const checkboxStateValues = [
  ...inputStateValues,
  'checked',
  'indeterminate',
] as const

export type CheckboxStateValue = typeof checkboxStateValues[number]

export type CheckboxState = AssertAssignable<CheckboxStateValue | 'rounded' | 'active', ResolverState>
export type CheckboxConfig = HightideResolverConfig

export const checkboxStateValueSet: ReadonlySet<CheckboxStateValue> = new Set(checkboxStateValues)

export type CheckboxComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
    color?: ColorPairToken,
  },
  state: ReadonlySet<CheckboxStateValue>,
}

export type CheckboxTokens = AssertAssignable<{
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
}, ComponentTokens<CheckboxState, CheckboxConfig>>

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

export type CheckboxParams = AssertAssignable<{
  colors: {
    color: ColorValueToken,
    accent: ColorValueToken,
    onColor: ColorValueToken,
    tint: ColorValueToken,
  },
  numbers: {
    size: NumberValueToken,
    borderRadius: NumberValueToken,
    inset: NumberValueToken,
  },
}, HightideResolverParams>
export type CheckboxTokenContext = HightideTokenPathProvider<CheckboxParams>

const checkboxDimension = TokenBuilder.round(
  TokenBuilder.calc('multiply', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.size'), TokenBuilder.numberValue(TokenBuilder.number(0.5)))
)

const checkboxInset = TokenBuilder.floor(
  TokenBuilder.calc('multiply', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.inset'), TokenBuilder.numberValue(TokenBuilder.number(0.5)))
)

const checkboxIconSize = TokenBuilder.calc(
  'subtract',
  checkboxDimension,
  TokenBuilder.calc(
    'multiply',
    TokenBuilder.numberValue(TokenBuilder.number(2)),
    TokenBuilder.calc('add', checkboxInset, TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal'))
  )
)

export const checkboxTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.colorValueRef<CheckboxTokenContext>('theme.color.surface.color'),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.accent'), ['disabled']),
        TokenBuilder.whenState(['disabled'], TokenBuilder.colorValueRef<CheckboxTokenContext>('theme.color.disabled.color')),
      ]
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    border: TokenBuilder.stateful(
      {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.color') }),
      },
      [
        TokenBuilder.whenState(['active'], undefined),
      ]
    ),
    size: TokenBuilder.stateful({
      width: checkboxDimension,
      height: checkboxDimension,
    }),
    borderRadius: TokenBuilder.stateful(TokenBuilder.corners({ value: TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderRadius.sm') }),
      [
        TokenBuilder.whenState(['rounded'], TokenBuilder.corners({ value: TokenBuilder.calc('divide', checkboxDimension, TokenBuilder.numberValue(TokenBuilder.number(2))) })),
      ]),
    padding: TokenBuilder.padding({ vertical: checkboxInset, horizontal: checkboxInset }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
    outline: TokenBuilder.stateful<OutlineTokens>(
      {
        width: TokenBuilder.numberValue(TokenBuilder.number(0)),
        offset: TokenBuilder.numberValue(TokenBuilder.number(0)),
        style: TokenBuilder.outlineStyle('solid'),
        color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
      },
      [
        TokenBuilder.whenState(['focusVisible'], {
          width: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<CheckboxTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.accent'),
        }, ['invalid']),
        TokenBuilder.whenState(['focusVisible', 'invalid'], {
          width: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<CheckboxTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorValueRef<CheckboxTokenContext>('theme.color.negative.color'),
        }),
      ]
    ),
  },
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.tint')),
    borderRadius: TokenBuilder.stateful(TokenBuilder.corners({ value: TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.borderRadius') }),
      [
        TokenBuilder.whenState(['rounded'], TokenBuilder.corners({ value: TokenBuilder.calc('divide', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.size'), TokenBuilder.numberValue(TokenBuilder.number(2))) })),
      ]),
  },
  icon: {
    type: 'icon',
    color: TokenBuilder.stateful(
      TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.accent'),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorValueRef<CheckboxTokenContext>('params.colors.onColor')),
      ]
    ),
    size: TokenBuilder.stateful(checkboxIconSize),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal')),
  },
} as const
