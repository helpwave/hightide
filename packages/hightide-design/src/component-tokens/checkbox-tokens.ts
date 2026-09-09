import { type ComponentSize, type ControlElementLayoutToken, type InputColoringTokens } from '../semantic-tokens'
import type { ColorToken } from '../primitive-tokens/color'
import { HexColorUtils } from '../utils/hex'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue,
  whenState,
  statefulField
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { inputStateValues } from './input-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from './token-config'
import type { TokenContext } from './token-context'

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

export type CheckboxParams = {
  layout: ControlElementLayoutToken,
  coloring: InputColoringTokens,
  tint: ColorToken,
  accentColor: ColorToken,
  accentOnColor: ColorToken,
}
export type CheckboxTokenContext = TokenContext<CheckboxParams>

const tokenVariable = createTokenVariable<CheckboxParams>()

const checkboxDimension = tokenCalc(
  'round',
  tokenCalc('multiply', tokenVariable('params.layout.size'), tokenValue(0.5))
)

const checkboxInset = tokenCalc(
  'floor',
  tokenCalc('multiply', tokenVariable('params.layout.inset'), tokenValue(0.5))
)

const checkboxIconSize = tokenCalc(
  'subtract',
  checkboxDimension,
  tokenCalc(
    'multiply',
    tokenValue(2),
    tokenCalc('add', checkboxInset, tokenVariable('theme.borderWidth.normal'))
  )
)

export const checkboxTokens = {
  container: {
    backgroundColor: statefulField<ColorToken, CheckboxTokenContext>(
      tokenVariable('theme.color.surface.color'),
      [
        whenState(['active'], tokenVariable('params.accentColor'), ['disabled']),
        whenState(['disabled'], tokenVariable('theme.color.disabled.color')),
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
          value: tokenVariable('theme.borderWidth.normal'),
        },
        color: {
          type: 'all',
          value: tokenVariable('params.coloring.border'),
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
    borderRadius: statefulField<NonNullable<ContainerTokens['borderRadius']>, CheckboxTokenContext>({
      type: 'all',
      value: tokenVariable('theme.borderRadius.sm'),
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
    outline: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['outline']>, CheckboxTokenContext>>(
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
          color: tokenVariable('params.accentColor'),
        }, ['invalid']),
        whenState(['focusVisible', 'invalid'], {
          width: tokenVariable('theme.focusOutline.width'),
          offset: tokenVariable('theme.focusOutline.offset'),
          style: tokenVariable('theme.focusOutline.style'),
          color: tokenVariable('theme.color.negative.color'),
        }),
      ]
    ),
  },
  stateLayer: {
    backgroundColor: stateful(tokenVariable('params.tint')),
    borderRadius: statefulField<NonNullable<ContainerTokens['borderRadius']>, CheckboxTokenContext>({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    },
    [
      whenState(['rounded'], {
        type: 'all',
        value: tokenCalc('divide', tokenVariable('params.layout.size'), tokenValue(2)),
      }),
    ]),
  },
  icon: {
    color: statefulField<ColorToken, CheckboxTokenContext>(
      tokenVariable('params.accentColor'),
      [
        whenState(['active'], tokenVariable('params.accentOnColor')),
      ]
    ),
    size: stateful(checkboxIconSize),
    strokeWidth: stateful(tokenVariable('theme.borderWidth.normal')),
  },
} as const satisfies ComponentTokenConfig<CheckboxTokens, CheckboxTokenContext>
