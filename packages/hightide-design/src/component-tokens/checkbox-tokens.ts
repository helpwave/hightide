import { type ComponentSize } from '../semantic-tokens'
import { HexColorUtils } from '../utils/hex'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { inputStateValues } from './input-tokens'
import type { Resolvable } from './resolvable'

export const checkboxStateValues = [
  ...inputStateValues,
  'checked',
  'indeterminate',
] as const

export type CheckboxStateValue = typeof checkboxStateValues[number]

export type CheckboxState = ReadonlySet<CheckboxStateValue>

export const checkboxStateValueSet: ReadonlySet<CheckboxStateValue> = new Set(checkboxStateValues)

export type CheckboxComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
    color?: ColorPairToken,
  },
  state: CheckboxState,
}

export type CheckboxTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
}

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

const checkboxDimension = tokenCalc(
  'round',
  tokenCalc('multiply', tokenPath('params.layout.size'), tokenValue(0.5))
)

const checkboxInset = tokenCalc(
  'floor',
  tokenCalc('multiply', tokenPath('params.layout.inset'), tokenValue(0.5))
)

const checkboxIconSize = tokenCalc(
  'subtract',
  checkboxDimension,
  tokenCalc(
    'multiply',
    tokenValue(2),
    tokenCalc('add', checkboxInset, tokenPath('theme.borderWidth.normal'))
  )
)

export const checkboxTokens = {
  container: {
    backgroundColor: stateful(
      tokenPath('theme.color.surface.color'),
      [
        whenState(['active'], tokenPath('params.accentColor'), ['disabled']),
        whenState(['disabled'], tokenPath('theme.color.disabled.color')),
      ]
    ),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful(
      {
        width: {
          type: 'all',
          value: tokenPath('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenPath('params.coloring.border'),
        },
      },
      [
        whenState(['active'], undefined),
      ]
    ),
    size: stateful({
      width: checkboxDimension,
      height: checkboxDimension,
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('theme.borderRadius.sm'),
    },
    [
      whenState(['rounded'], {
        type: 'all',
        value: tokenCalc('divide', checkboxDimension, tokenValue(2)),
      }),
    ]),
    padding: stateful({
      type: 'physicalAxis',
      vertical: checkboxInset,
      horizontal: checkboxInset,
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
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
          color: tokenPath('params.accentColor'),
        }, ['invalid']),
        whenState(['focusVisible', 'invalid'], {
          width: tokenPath('theme.focusOutline.width'),
          offset: tokenPath('theme.focusOutline.offset'),
          style: tokenPath('theme.focusOutline.style'),
          color: tokenPath('theme.color.negative.color'),
        }),
      ]
    ),
  },
  stateLayer: {
    backgroundColor: stateful(tokenPath('params.tint')),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    },
    [
      whenState(['rounded'], {
        type: 'all',
        value: tokenCalc('divide', tokenPath('params.layout.size'), tokenValue(2)),
      }),
    ]),
  },
  icon: {
    color: stateful(
      tokenPath('params.accentColor'),
      [
        whenState(['active'], tokenPath('params.accentOnColor')),
      ]
    ),
    size: stateful(checkboxIconSize),
    strokeWidth: stateful(tokenPath('theme.borderWidth.normal')),
  },
} as const
