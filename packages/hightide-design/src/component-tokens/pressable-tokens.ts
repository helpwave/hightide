import {
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export const pressableStateValues = [
  'disabled',
  'focused',
  'focusVisible',
  'hovered',
  'pressed',
] as const

export type PressableStateValue = typeof pressableStateValues[number]

export type PressableState = ReadonlySet<PressableStateValue>

export const pressableStateValueSet: ReadonlySet<PressableStateValue> = new Set(pressableStateValues)

export const isPressableStateValue = (value: string): value is PressableStateValue => (
  pressableStateValueSet.has(value as PressableStateValue)
)

export const toPressableState = (state: ReadonlySet<string>): PressableState => {
  const active = new Set<PressableStateValue>()
  for (const value of state) {
    if (isPressableStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export type PressableComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: ColoringStyle,
    coloringColorVariant?: ColoringColorVariant,
    hasAdditionalHorizontalPadding?: boolean,
  },
  state: PressableState,
}

export type PressableTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type PressableOverrideTokens = Partial<PressableTokens> & {
  overrides?: PressableComponentResolverProps['overrides'],
}

export type PressableTokenResolver = ComponentTokenResolver<
  PressableComponentResolverProps,
  PressableTokens
>

export const pressableTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    outline: stateful(
      {
        width: tokenValue(0),
        offset: tokenValue(0),
        style: 'solid',
        color: {
          value: 'transparent',
        },
      },
      [
        whenState(['outlined', 'focusVisible'], {
          width: tokenPath('theme.focusOutline.width'),
          offset: tokenPath('theme.focusOutline.offset'),
          style: tokenPath('theme.focusOutline.style'),
          color: tokenPath('params.coloring.outline'),
        }),
      ]
    ),
    size: stateful({
      minHeight: tokenPath('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    }),
    padding: stateful(
      {
        type: 'physicalAxis',
        vertical: tokenPath('params.layout.inset'),
        horizontal: tokenPath('params.layout.inset'),
      },
      [
        whenState(['additionalHorizontalPadding'], {
          type: 'physicalAxis',
          vertical: tokenPath('params.layout.inset'),
          horizontal: tokenPath('params.layout.horizontalContentPadding'),
        }),
      ]
    ),
    layout: stateful({
      gap: tokenPath('params.gap'),
      direction: 'horizontal',
      mainAxisAlignment: 'center',
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
  icon: {
    size: stateful(tokenPath('params.iconSize')),
    strokeWidth: stateful(tokenPath('params.iconStrokeWidth')),
    color: stateful(tokenPath('params.coloring.foreground')),
  },
  text: {
    color: stateful(tokenPath('params.coloring.foreground')),
    fontSize: stateful(tokenPath('params.textStyle.fontSize')),
    fontWeight: stateful(tokenPath('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenPath('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenPath('params.textStyle.lineHeight')),
  },
} as const
