import type { ColorToken } from '../primitive-tokens/color'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  createTokenVariable,
  tokenValue,
  whenState,
  statefulField
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { inputStateValues } from './input-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from './token-config'
import type { TokenContext } from './token-context'

export const switchStateValues = [
  ...inputStateValues,
  'active',
] as const

export type SwitchStateValue = typeof switchStateValues[number]

export type SwitchState = ReadonlySet<SwitchStateValue>

export const switchStateValueSet: ReadonlySet<SwitchStateValue> = new Set(switchStateValues)

export type SwitchComponentResolverProps = {
  state: SwitchState,
}

export type SwitchTokens = {
  container: ContainerTokens,
  track: ContainerTokens,
  thumb: ContainerTokens,
}

export type SwitchTokenResolver = ComponentTokenResolver<
  SwitchComponentResolverProps,
  SwitchTokens
>

export type SwitchParams = {
  tint: ColorToken,
}
export type SwitchTokenContext = TokenContext<SwitchParams>

const tokenVariable = createTokenVariable<SwitchParams>()

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 28
const THUMB_SIZE_ACTIVE = 20
const THUMB_SIZE_INACTIVE = 16

const trackWidth = tokenValue(TRACK_WIDTH)
const trackHeight = tokenValue(TRACK_HEIGHT)
const doubleBorder = tokenCalc(
  'multiply',
  tokenValue(2),
  tokenVariable('theme.borderWidth.normal')
)
const trackInnerWidth = tokenCalc('subtract', trackWidth, doubleBorder)
const trackInnerHeight = tokenCalc('subtract', trackHeight, doubleBorder)

const thumbSizeInactive = tokenValue(THUMB_SIZE_INACTIVE)
const thumbSizeActive = tokenValue(THUMB_SIZE_ACTIVE)
const thumbInsetInactive = tokenCalc(
  'divide',
  tokenCalc('subtract', trackInnerHeight, thumbSizeInactive),
  tokenValue(2)
)
const thumbInsetActive = tokenCalc(
  'divide',
  tokenCalc('subtract', trackInnerHeight, thumbSizeActive),
  tokenValue(2)
)
const thumbLeftInactive = thumbInsetInactive
const thumbLeftActive = tokenCalc(
  'subtract',
  tokenCalc('subtract', trackInnerWidth, thumbSizeActive),
  thumbInsetActive
)

const inactiveThumbColor = tokenColorBlend(
  tokenVariable('theme.color.surface.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.surface.onColor'),
    tokenVariable('theme.config.appearancePercentages.subtle')
  )
)

const trackBackgroundInactive = tokenVariable('theme.color.surface.color')
const trackBackgroundActive = tokenVariable('theme.color.primary.color')
const trackBackgroundDisabled = tokenVariable('theme.color.disabled.color')

export const switchTokens = {
  container: {
    size: stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
    outline: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['outline']>, SwitchTokenContext> | undefined>(
      undefined,
      [
        whenState(['focusVisible'], {
          color: {
            value: HexColorUtils.transparent,
          },
        }),
      ]
    ),
  },
  track: {
    backgroundColor: statefulField<ColorToken, SwitchTokenContext>(
      tokenColorBlend(trackBackgroundInactive, tokenVariable('params.tint')),
      [
        whenState(['active'], tokenColorBlend(trackBackgroundActive, tokenVariable('params.tint')), ['disabled']),
        whenState(['disabled'], tokenColorBlend(trackBackgroundDisabled, tokenVariable('params.tint'))),
      ]
    ),
    border: statefulField<NonNullable<ContainerTokens['border']>, SwitchTokenContext>({
      width: {
        type: 'all',
        value: tokenVariable('theme.borderWidth.normal'),
      },
      color: {
        type: 'all',
        value: tokenColorBlend(
          tokenVariable('theme.color.border'),
          tokenVariable('params.tint')
        ),
      },
    }, [
      whenState(['active'], {
        width: {
          type: 'all',
          value: tokenVariable('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenVariable('theme.color.primary.color'),
            tokenVariable('params.tint')
          ),
        },
      }, ['disabled', 'invalid']),
      whenState(['invalid'], {
        width: {
          type: 'all',
          value: tokenVariable('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenVariable('theme.color.negative.color'),
            tokenVariable('params.tint')
          ),
        },
      }, ['disabled']),
      whenState(['disabled'], {
        width: {
          type: 'all',
          value: tokenVariable('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenVariable('theme.color.disabled.color'),
            tokenVariable('params.tint')
          ),
        },
      }),
    ]),
    size: stateful({
      width: trackWidth,
      height: trackHeight,
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', trackHeight, tokenValue(2)),
    }),
    position: stateful({
      type: 'relative',
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
    outline: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['outline']>, SwitchTokenContext>>(
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
          color: tokenVariable('theme.color.primary.color'),
        }),
      ]
    ),
  },
  thumb: {
    backgroundColor: statefulField<ColorToken, SwitchTokenContext>(
      inactiveThumbColor,
      [
        whenState(['active'], tokenVariable('theme.color.primary.onColor')),
      ]
    ),
    size: statefulField<NonNullable<ContainerTokens['size']>, SwitchTokenContext>({
      width: thumbSizeInactive,
      height: thumbSizeInactive,
    }, [
      whenState(['active'], {
        width: thumbSizeActive,
        height: thumbSizeActive,
      }),
    ]),
    borderRadius: statefulField<NonNullable<ContainerTokens['borderRadius']>, SwitchTokenContext>({
      type: 'all',
      value: tokenCalc('divide', thumbSizeInactive, tokenValue(2)),
    },
    [
      whenState(['active'], {
        type: 'all',
        value: tokenCalc('divide', thumbSizeActive, tokenValue(2)),
      }),
    ]),
    position: statefulField<NonNullable<ContainerTokens['position']>, SwitchTokenContext>({
      type: 'absolute',
      top: thumbInsetInactive,
    }, [
      whenState(['active'], {
        type: 'absolute',
        top: thumbInsetActive,
      }),
    ]),
    transform: statefulField<NonNullable<ContainerTokens['transform']>, SwitchTokenContext>({
      translate: {
        x: thumbLeftInactive,
      },
    }, [
      whenState(['active'], {
        translate: {
          x: thumbLeftActive,
        },
      }),
    ]),
  },
} as const satisfies ComponentTokenConfig<SwitchTokens, SwitchTokenContext>
