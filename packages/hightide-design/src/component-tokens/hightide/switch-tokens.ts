import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens, ResolvableOutlineTokens } from '../resolvable-container-tokens'
import { inputStateValues } from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'

export const switchStateValues = [
  ...inputStateValues,
  'active',
] as const

export type SwitchStateValue = typeof switchStateValues[number]

export type SwitchState = AssertAssignable<SwitchStateValue, ResolverState>
export type SwitchConfig = HightideResolverConfig

export const switchStateValueSet: ReadonlySet<SwitchStateValue> = new Set(switchStateValues)

export type SwitchComponentResolverProps = {
  state: ReadonlySet<SwitchStateValue>,
}

export type SwitchTokens = AssertAssignable<{
  container: ResolvableContainerTokens<SwitchState, SwitchConfig>,
  track: ResolvableContainerTokens<SwitchState, SwitchConfig>,
  thumb: ResolvableContainerTokens<SwitchState, SwitchConfig>,
}, ComponentTokens<SwitchState, SwitchConfig>>

export type SwitchTokenResolver = ComponentTokenResolver<
  SwitchComponentResolverProps,
  SwitchTokens
>

export type SwitchParams = AssertAssignable<{
  colors: {
    tint: ColorValueToken,
  },
}, HightideResolverParams>
export type SwitchTokenContext = HightideTokenPathProvider<SwitchParams>

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 28
const THUMB_SIZE_ACTIVE = 20
const THUMB_SIZE_INACTIVE = 16

const trackWidth = TokenBuilder.numberValue(TokenBuilder.number(TRACK_WIDTH))
const trackHeight = TokenBuilder.numberValue(TokenBuilder.number(TRACK_HEIGHT))
const doubleBorder = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberValue(TokenBuilder.number(2)),
  TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal')
)
const trackInnerWidth = TokenBuilder.calc('subtract', trackWidth, doubleBorder)
const trackInnerHeight = TokenBuilder.calc('subtract', trackHeight, doubleBorder)

const thumbSizeInactive = TokenBuilder.numberValue(TokenBuilder.number(THUMB_SIZE_INACTIVE))
const thumbSizeActive = TokenBuilder.numberValue(TokenBuilder.number(THUMB_SIZE_ACTIVE))
const thumbInsetInactive = TokenBuilder.calc(
  'divide',
  TokenBuilder.calc('subtract', trackInnerHeight, thumbSizeInactive),
  TokenBuilder.numberValue(TokenBuilder.number(2))
)
const thumbInsetActive = TokenBuilder.calc(
  'divide',
  TokenBuilder.calc('subtract', trackInnerHeight, thumbSizeActive),
  TokenBuilder.numberValue(TokenBuilder.number(2))
)
const thumbLeftInactive = thumbInsetInactive
const thumbLeftActive = TokenBuilder.calc(
  'subtract',
  TokenBuilder.calc('subtract', trackInnerWidth, thumbSizeActive),
  thumbInsetActive
)

const inactiveThumbColor = TokenBuilder.colorBlend(
  TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.surface.onColor'),
    TokenBuilder.numberRef<SwitchTokenContext>('theme.config.appearancePercentages.subtle')
  )
)

const trackBackgroundInactive = TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.surface.color')
const trackBackgroundActive = TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.primary.color')
const trackBackgroundDisabled = TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.disabled.color')

export const switchTokens = {
  container: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
    outline: TokenBuilder.stateful<ResolvableOutlineTokens>(
      undefined,
      [
        TokenBuilder.whenState(['focusVisible'], {
          color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
        }),
      ]
    ),
  },
  track: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.colorBlend(trackBackgroundInactive, TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorBlend(trackBackgroundActive, TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')), ['disabled']),
        TokenBuilder.whenState(['disabled'], TokenBuilder.colorBlend(trackBackgroundDisabled, TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint'))),
      ]
    ),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
        TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.border'),
        TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')
      ) }),
    }, [
      TokenBuilder.whenState(['active'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
          TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.primary.color'),
          TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')
        ) }),
      }, ['disabled', 'invalid']),
      TokenBuilder.whenState(['invalid'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
          TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.negative.color'),
          TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')
        ) }),
      }, ['disabled']),
      TokenBuilder.whenState(['disabled'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
          TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.disabled.color'),
          TokenBuilder.colorValueRef<SwitchTokenContext>('params.colors.tint')
        ) }),
      }),
    ]),
    size: TokenBuilder.stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', trackHeight, TokenBuilder.numberValue(TokenBuilder.number(2))) }),
    position: TokenBuilder.stateful({
      type: 'relative' as const,
    }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('start'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
    outline: TokenBuilder.stateful<ResolvableOutlineTokens>(
      {
        width: TokenBuilder.numberValue(TokenBuilder.number(0)),
        offset: TokenBuilder.numberValue(TokenBuilder.number(0)),
        style: TokenBuilder.outlineStyle('solid'),
        color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
      },
      [
        TokenBuilder.whenState(['focusVisible'], {
          width: TokenBuilder.numberRef<SwitchTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<SwitchTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<SwitchTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.primary.color'),
        }),
      ]
    ),
  },
  thumb: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(
      inactiveThumbColor,
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorValueRef<SwitchTokenContext>('theme.color.primary.onColor')),
      ]
    ),
    size: TokenBuilder.stateful({
      width: thumbSizeInactive,
      height: thumbSizeInactive,
    }, [
      TokenBuilder.whenState(['active'], {
        width: thumbSizeActive,
        height: thumbSizeActive,
      }),
    ]),
    borderRadius: TokenBuilder.stateful(TokenBuilder.corners({ value: TokenBuilder.calc('divide', thumbSizeInactive, TokenBuilder.numberValue(TokenBuilder.number(2))) }),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.corners({ value: TokenBuilder.calc('divide', thumbSizeActive, TokenBuilder.numberValue(TokenBuilder.number(2))) })),
      ]),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: thumbInsetInactive,
    }, [
      TokenBuilder.whenState(['active'], {
        type: 'absolute' as const,
        top: thumbInsetActive,
      }),
    ]),
    transform: TokenBuilder.stateful({
      translate: {
        x: thumbLeftInactive,
      },
    }, [
      TokenBuilder.whenState(['active'], {
        translate: {
          x: thumbLeftActive,
        },
      }),
    ]),
  },
} as const
