import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorToken } from '../../primitive-tokens/color-token'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ContainerTokens } from '../container-tokens'
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
    tint: ColorToken,
  },
}, HightideResolverParams>
export type SwitchTokenContext = HightideTokenPathProvider<SwitchParams>

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 28
const THUMB_SIZE_ACTIVE = 20
const THUMB_SIZE_INACTIVE = 16

const trackWidth = TokenBuilder.number(TRACK_WIDTH)
const trackHeight = TokenBuilder.number(TRACK_HEIGHT)
const doubleBorder = TokenBuilder.calc(
  'multiply',
  TokenBuilder.number(2),
  TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal')
)
const trackInnerWidth = TokenBuilder.calc('subtract', trackWidth, doubleBorder)
const trackInnerHeight = TokenBuilder.calc('subtract', trackHeight, doubleBorder)

const thumbSizeInactive = TokenBuilder.number(THUMB_SIZE_INACTIVE)
const thumbSizeActive = TokenBuilder.number(THUMB_SIZE_ACTIVE)
const thumbInsetInactive = TokenBuilder.calc(
  'divide',
  TokenBuilder.calc('subtract', trackInnerHeight, thumbSizeInactive),
  TokenBuilder.number(2)
)
const thumbInsetActive = TokenBuilder.calc(
  'divide',
  TokenBuilder.calc('subtract', trackInnerHeight, thumbSizeActive),
  TokenBuilder.number(2)
)
const thumbLeftInactive = thumbInsetInactive
const thumbLeftActive = TokenBuilder.calc(
  'subtract',
  TokenBuilder.calc('subtract', trackInnerWidth, thumbSizeActive),
  thumbInsetActive
)

const inactiveThumbColor = TokenBuilder.colorBlend(
  TokenBuilder.colorRef<SwitchTokenContext>('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorRef<SwitchTokenContext>('theme.color.surface.onColor'),
    TokenBuilder.numberRef<SwitchTokenContext>('theme.config.appearancePercentages.subtle')
  )
)

const trackBackgroundInactive = TokenBuilder.colorRef<SwitchTokenContext>('theme.color.surface.color')
const trackBackgroundActive = TokenBuilder.colorRef<SwitchTokenContext>('theme.color.primary.color')
const trackBackgroundDisabled = TokenBuilder.colorRef<SwitchTokenContext>('theme.color.disabled.color')

export const switchTokens = {
  container: {
    kind: 'container' as const,
    size: TokenBuilder.stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.6)),
      ]
    ),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    outline: TokenBuilder.stateful(
      undefined,
      [
        TokenBuilder.whenState(['focusVisible'], {
          color: TokenBuilder.color(HexColorUtils.transparent),
        }),
      ]
    ),
  },
  track: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.statefulField<ColorToken, SwitchTokenContext>(
      TokenBuilder.colorBlend(trackBackgroundInactive, TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')),
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorBlend(trackBackgroundActive, TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')), ['disabled']),
        TokenBuilder.whenState(['disabled'], TokenBuilder.colorBlend(trackBackgroundDisabled, TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint'))),
      ]
    ),
    border: TokenBuilder.statefulField<NonNullable<ContainerTokens['border']>, SwitchTokenContext>({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
          TokenBuilder.colorRef<SwitchTokenContext>('theme.color.border'),
          TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')
        ) }),
    }, [
      TokenBuilder.whenState(['active'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
            TokenBuilder.colorRef<SwitchTokenContext>('theme.color.primary.color'),
            TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')
          ) }),
      }, ['disabled', 'invalid']),
      TokenBuilder.whenState(['invalid'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
            TokenBuilder.colorRef<SwitchTokenContext>('theme.color.negative.color'),
            TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')
          ) }),
      }, ['disabled']),
      TokenBuilder.whenState(['disabled'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef<SwitchTokenContext>('theme.borderWidth.normal') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorBlend(
            TokenBuilder.colorRef<SwitchTokenContext>('theme.color.disabled.color'),
            TokenBuilder.colorRef<SwitchTokenContext>('params.colors.tint')
          ) }),
      }),
    ]),
    size: TokenBuilder.stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.calc('divide', trackHeight, TokenBuilder.number(2)) }),
    position: TokenBuilder.stateful({
      type: 'relative',
    }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
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
          width: TokenBuilder.numberRef<SwitchTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<SwitchTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<SwitchTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorRef<SwitchTokenContext>('theme.color.primary.color'),
        }),
      ]
    ),
  },
  thumb: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.statefulField<ColorToken, SwitchTokenContext>(
      inactiveThumbColor,
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorRef<SwitchTokenContext>('theme.color.primary.onColor')),
      ]
    ),
    size: TokenBuilder.statefulField<NonNullable<ContainerTokens['size']>, SwitchTokenContext>({
      width: thumbSizeInactive,
      height: thumbSizeInactive,
    }, [
      TokenBuilder.whenState(['active'], {
        width: thumbSizeActive,
        height: thumbSizeActive,
      }),
    ]),
    borderRadius: TokenBuilder.statefulField<NonNullable<ContainerTokens['borderRadius']>, SwitchTokenContext>(TokenBuilder.corners({ value: TokenBuilder.calc('divide', thumbSizeInactive, TokenBuilder.number(2)) }),
    [
      TokenBuilder.whenState(['active'], TokenBuilder.sides({ value: TokenBuilder.calc('divide', thumbSizeActive, TokenBuilder.number(2)) })),
    ]),
    position: TokenBuilder.statefulField<NonNullable<ContainerTokens['position']>, SwitchTokenContext>({
      type: 'absolute',
      top: thumbInsetInactive,
    }, [
      TokenBuilder.whenState(['active'], {
        type: 'absolute',
        top: thumbInsetActive,
      }),
    ]),
    transform: TokenBuilder.statefulField<NonNullable<ContainerTokens['transform']>, SwitchTokenContext>({
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
