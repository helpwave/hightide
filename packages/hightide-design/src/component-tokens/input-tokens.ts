import type { ColorToken } from '../primitive-tokens/color'
import { hightideShadow } from '../primitive-tokens/shadow'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { TypographyStyleToken } from '../theme-tokens/typography-style-token'
import {
  type ControlElementLayoutToken,
  type InputColoringTokens
} from '../semantic-tokens'
import {
  stateful,
  tokenCalc,
  tokenColorOpacity,
  createTokenVariable,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  pressableStateValues
} from './pressable-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from './token-config'
import type { TokenContext } from './token-context'

export const inputStateValues = [
  ...pressableStateValues,
  'readonly',
  'invalid',
] as const

export type InputStateValue = typeof inputStateValues[number]

export type InputState = ReadonlySet<InputStateValue>

export const inputStateValueSet: ReadonlySet<InputStateValue> = new Set(inputStateValues)

export const isInputStateValue = (value: string): value is InputStateValue => (
  inputStateValueSet.has(value as InputStateValue)
)

export const toInputState = (state: ReadonlySet<string>): InputState => {
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
  state: InputState,
}

export type InputTextTokens = TextStyleTokens

export type InputTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  text: InputTextTokens,
  placeholder: TextStyleTokens,
  icon: IconTokens,
}

export type InputTokenResolver = ComponentTokenResolver<
  InputComponentResolverProps,
  InputTokens
>

export type InputParams = {
  layout: ControlElementLayoutToken,
  coloring: InputColoringTokens,
  tint: ColorToken,
  textStyle: TypographyStyleToken,
  placeholderColor: ColorToken,
  iconSize: number,
  iconStrokeWidth: number,
  outlineColor: ColorToken,
}
export type InputTokenContext = TokenContext<InputParams>

const tokenVariable = createTokenVariable<InputParams>()

export const inputTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('params.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful({
      width: {
        type: 'all',
        value: tokenVariable('params.layout.borderWidth'),
      },
      color: {
        type: 'all',
        value: tokenVariable('params.coloring.border'),
      },
    }),
    outline: stateful({
      width: tokenVariable('theme.focusOutline.width'),
      offset: tokenVariable('theme.focusOutline.offset'),
      style: tokenVariable('theme.focusOutline.style'),
      color: tokenVariable('params.outlineColor'),
    }),
    shadow: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['shadow']>, InputTokenContext> | undefined>(
      undefined,
      [
        whenState(['hasFocusShadow'], {
          x: tokenValue(hightideShadow.layout.basic.md.x),
          y: tokenValue(hightideShadow.layout.basic.md.y),
          blur: tokenValue(hightideShadow.layout.basic.md.blur),
          spread: tokenValue(hightideShadow.layout.basic.md.spread),
          color: tokenColorOpacity(
            tokenVariable('params.coloring.border'),
            tokenValue(0.7)
          ),
        }),
      ]
    ),
    size: stateful({
      minHeight: tokenVariable('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('params.layout.inset'),
      horizontal: tokenCalc(
        'subtract',
        tokenVariable('params.layout.horizontalContentPadding'),
        tokenVariable('params.layout.borderWidth')
      ),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  stateLayer: {
    backgroundColor: stateful(tokenVariable('params.tint')),
    position: stateful({
      type: 'absolute',
      top: tokenValue(0),
      right: tokenValue(0),
      bottom: tokenValue(0),
      left: tokenValue(0),
      zIndex: tokenValue(20),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    }),
  },
  text: {
    color: stateful(tokenVariable('params.coloring.text')),
    fontSize: stateful(tokenVariable('params.textStyle.fontSize')),
    fontWeight: stateful(tokenVariable('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenVariable('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenVariable('params.textStyle.lineHeight')),
  },
  placeholder: {
    color: stateful(tokenVariable('params.placeholderColor')),
    fontSize: stateful(tokenVariable('params.textStyle.fontSize')),
    fontWeight: stateful(tokenVariable('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenVariable('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenVariable('params.textStyle.lineHeight')),
  },
  icon: {
    size: stateful(tokenVariable('params.iconSize')),
    strokeWidth: stateful(tokenVariable('params.iconStrokeWidth')),
    color: stateful(tokenVariable('params.coloring.text')),
  },
} as const satisfies ComponentTokenConfig<InputTokens, InputTokenContext>
