import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { inputStateValues } from './input-tokens'
import type { Resolvable } from './resolvable'

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

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 28
const THUMB_SIZE_ACTIVE = 20
const THUMB_SIZE_INACTIVE = 16

const trackWidth = tokenValue(TRACK_WIDTH)
const trackHeight = tokenValue(TRACK_HEIGHT)
const doubleBorder = tokenCalc(
  'multiply',
  tokenValue(2),
  tokenPath('theme.borderWidth.normal')
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
  tokenPath('theme.color.surface.color'),
  tokenColorOpacity(
    tokenPath('theme.color.surface.onColor'),
    tokenPath('theme.config.appearancePercentages.subtle')
  )
)

const trackBackgroundInactive = tokenPath('theme.color.surface.color')
const trackBackgroundActive = tokenPath('theme.color.primary.color')
const trackBackgroundDisabled = tokenPath('theme.color.disabled.color')

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
    outline: stateful(
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
    backgroundColor: stateful(
      tokenColorBlend(trackBackgroundInactive, tokenPath('params.tint')),
      [
        whenState(['active'], tokenColorBlend(trackBackgroundActive, tokenPath('params.tint')), ['disabled']),
        whenState(['disabled'], tokenColorBlend(trackBackgroundDisabled, tokenPath('params.tint'))),
      ]
    ),
    border: stateful({
      width: {
        type: 'all',
        value: tokenPath('theme.borderWidth.normal'),
      },
      color: {
        type: 'all',
        value: tokenColorBlend(
          tokenPath('theme.color.border'),
          tokenPath('params.tint')
        ),
      },
    }, [
      whenState(['active'], {
        width: {
          type: 'all',
          value: tokenPath('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenPath('theme.color.primary.color'),
            tokenPath('params.tint')
          ),
        },
      }, ['disabled', 'invalid']),
      whenState(['invalid'], {
        width: {
          type: 'all',
          value: tokenPath('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenPath('theme.color.negative.color'),
            tokenPath('params.tint')
          ),
        },
      }, ['disabled']),
      whenState(['disabled'], {
        width: {
          type: 'all',
          value: tokenPath('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenColorBlend(
            tokenPath('theme.color.disabled.color'),
            tokenPath('params.tint')
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
          width: tokenPath('theme.focusOutline.width'),
          offset: tokenPath('theme.focusOutline.offset'),
          style: tokenPath('theme.focusOutline.style'),
          color: tokenPath('theme.color.primary.color'),
        }),
      ]
    ),
  },
  thumb: {
    backgroundColor: stateful(
      inactiveThumbColor,
      [
        whenState(['active'], tokenPath('theme.color.primary.onColor')),
      ]
    ),
    size: stateful({
      width: thumbSizeInactive,
      height: thumbSizeInactive,
    }, [
      whenState(['active'], {
        width: thumbSizeActive,
        height: thumbSizeActive,
      }),
    ]),
    borderRadius: stateful({
      type: 'all',
      value: tokenCalc('divide', thumbSizeInactive, tokenValue(2)),
    },
    [
      whenState(['active'], {
        type: 'all',
        value: tokenCalc('divide', thumbSizeActive, tokenValue(2)),
      }),
    ]),
    position: stateful({
      type: 'absolute',
      top: thumbInsetInactive,
    }, [
      whenState(['active'], {
        type: 'absolute',
        top: thumbInsetActive,
      }),
    ]),
    transform: stateful({
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
} as const
