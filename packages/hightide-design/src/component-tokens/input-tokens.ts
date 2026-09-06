import { hightideShadow } from '../primitive-tokens/shadow'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  tokenColorOpacity,
  tokenPath,
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

export const inputTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful({
      width: {
        type: 'all',
        value: tokenPath('params.layout.borderWidth'),
      },
      color: {
        type: 'all',
        value: tokenPath('params.coloring.border'),
      },
    }),
    outline: stateful({
      width: tokenPath('theme.focusOutline.width'),
      offset: tokenPath('theme.focusOutline.offset'),
      style: tokenPath('theme.focusOutline.style'),
      color: tokenPath('params.outlineColor'),
    }),
    shadow: stateful(undefined,
      [
        whenState(['hasFocusShadow'], {
          ...hightideShadow.layout.basic.md,
          color: tokenColorOpacity(
            tokenPath('params.coloring.border'),
            tokenValue(0.7)
          ),
        }),
      ]),
    size: stateful({
      minHeight: tokenPath('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('params.layout.inset'),
      horizontal: tokenCalc(
        'subtract',
        tokenPath('params.layout.horizontalContentPadding'),
        tokenPath('params.layout.borderWidth')
      ),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  stateLayer: {
    backgroundColor: stateful(tokenPath('params.tint')),
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
      value: tokenPath('params.layout.borderRadius'),
    }),
  },
  text: {
    color: stateful(tokenPath('params.coloring.text')),
    fontSize: stateful(tokenPath('params.textStyle.fontSize')),
    fontWeight: stateful(tokenPath('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenPath('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenPath('params.textStyle.lineHeight')),
  },
  placeholder: {
    color: stateful(tokenPath('params.placeholderColor')),
    fontSize: stateful(tokenPath('params.textStyle.fontSize')),
    fontWeight: stateful(tokenPath('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenPath('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenPath('params.textStyle.lineHeight')),
  },
  icon: {
    size: stateful(tokenPath('params.iconSize')),
    strokeWidth: stateful(tokenPath('params.iconStrokeWidth')),
    color: stateful(tokenPath('params.coloring.text')),
  },
} as const
