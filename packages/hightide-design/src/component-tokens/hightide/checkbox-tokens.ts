import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { type ComponentSize } from '../../semantic-tokens'
import type { ColorToken } from '../../primitive-tokens/color-token'
import { HexColorUtils } from '../../utils/hex'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
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
  container: ResolvableContainerTokens<CheckboxState, CheckboxConfig>,
  stateLayer: ResolvableContainerTokens<CheckboxState, CheckboxConfig>,
  icon: ResolvableIconTokens<CheckboxState, CheckboxConfig>,
}, ComponentTokens<CheckboxState, CheckboxConfig>>

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

export type CheckboxParams = AssertAssignable<{
  colors: {
    color: ColorToken,
    accent: ColorToken,
    onColor: ColorToken,
    tint: ColorToken,
  },
  numbers: {
    size: NumberToken,
    borderRadius: NumberToken,
    inset: NumberToken,
  },
}, HightideResolverParams>
export type CheckboxTokenContext = HightideTokenPathProvider<CheckboxParams>

const checkboxDimension = TokenBuilder.round(
  TokenBuilder.calc('multiply', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.size'), TokenBuilder.number(0.5))
)

const checkboxInset = TokenBuilder.floor(
  TokenBuilder.calc('multiply', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.inset'), TokenBuilder.number(0.5))
)

const checkboxIconSize = TokenBuilder.calc(
  'subtract',
  checkboxDimension,
  TokenBuilder.calc(
    'multiply',
    TokenBuilder.number(2),
    TokenBuilder.calc('add', checkboxInset, TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal'))
  )
)

export const checkboxTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.statefulField<ColorToken, CheckboxTokenContext>(
      TokenBuilder.colorRef<CheckboxTokenContext>('theme.color.surface.color'),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.accent'), ['disabled']),
        TokenBuilder.whenState(['disabled'], TokenBuilder.colorRef<CheckboxTokenContext>('theme.color.disabled.color')),
      ]
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.6)),
      ]
    ),
    border: TokenBuilder.stateful(
      {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.color') }),
      },
      [
        TokenBuilder.whenState(['active'], undefined),
      ]
    ),
    size: TokenBuilder.stateful({
      width: checkboxDimension,
      height: checkboxDimension,
    }),
    borderRadius: TokenBuilder.statefulField<NonNullable<ContainerTokens['borderRadius']>, CheckboxTokenContext>(TokenBuilder.corners({ value: TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderRadius.sm') }),
    [
      TokenBuilder.whenState(['rounded'], TokenBuilder.sides({ value: TokenBuilder.calc('divide', checkboxDimension, TokenBuilder.number(2)) })),
    ]),
    padding: TokenBuilder.padding({ vertical: checkboxInset, horizontal: checkboxInset }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    outline: TokenBuilder.stateful(
      {
        width: TokenBuilder.number(0),
        offset: TokenBuilder.number(0),
        style: 'solid',
        color: TokenBuilder.color(HexColorUtils.transparent),
      },
      [
        TokenBuilder.whenState(['focusVisible'], {
          width: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<CheckboxTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.accent'),
        }, ['invalid']),
        TokenBuilder.whenState(['focusVisible', 'invalid'], {
          width: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<CheckboxTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<CheckboxTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorRef<CheckboxTokenContext>('theme.color.negative.color'),
        }),
      ]
    ),
  },
  stateLayer: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.tint')),
    borderRadius: TokenBuilder.statefulField<NonNullable<ContainerTokens['borderRadius']>, CheckboxTokenContext>(TokenBuilder.corners({ value: TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.borderRadius') }),
    [
      TokenBuilder.whenState(['rounded'], TokenBuilder.sides({ value: TokenBuilder.calc('divide', TokenBuilder.numberRef<CheckboxTokenContext>('params.numbers.size'), TokenBuilder.number(2)) })),
    ]),
  },
  icon: {
    kind: 'icon' as const,
    color: TokenBuilder.statefulField<ColorToken, CheckboxTokenContext>(
      TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.accent'),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorRef<CheckboxTokenContext>('params.colors.onColor')),
      ]
    ),
    size: TokenBuilder.stateful(checkboxIconSize),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<CheckboxTokenContext>('theme.borderWidth.normal')),
  },
} as const
