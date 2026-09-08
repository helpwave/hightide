import {
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenValue,
  tokenVariable,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { Resolvable } from './resolvable'
import type { TextStyleTokens } from './text-style-tokens'
import {
  pressableButtonBorderRadius,
  pressableButtonFontFamily,
  pressableButtonFontSize,
  pressableButtonFontWeight,
  pressableButtonGap,
  pressableButtonIconSize,
  pressableButtonIconStrokeWidth,
  pressableButtonLineHeight,
  pressableButtonMinHeight,
  pressablePadding
} from './pressable-button-shared-tokens'

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
    backgroundColor: stateful(tokenVariable('semantics.coloring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
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
        whenState(['outlined', 'focusVisible'], {
          width: tokenVariable('theme.focusOutline.width'),
          offset: tokenVariable('theme.focusOutline.offset'),
          style: tokenVariable('theme.focusOutline.style'),
          color: tokenVariable('semantics.coloring.outline'),
        }),
      ]
    ),
    size: {
      minHeight: pressableButtonMinHeight,
    },
    borderRadius: pressableButtonBorderRadius,
    padding: pressablePadding,
    layout: {
      gap: pressableButtonGap,
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    },
  },
  stateLayer: {
    backgroundColor: stateful(tokenVariable('semantics.stateLayerTint')),
    position: stateful({
      type: 'absolute',
      top: tokenValue(0),
      right: tokenValue(0),
      bottom: tokenValue(0),
      left: tokenValue(0),
      zIndex: tokenValue(20),
    }),
    borderRadius: pressableButtonBorderRadius,
  },
  icon: {
    size: pressableButtonIconSize,
    strokeWidth: pressableButtonIconStrokeWidth,
    color: stateful(tokenVariable('semantics.coloring.foreground')),
  },
  text: {
    color: stateful(tokenVariable('semantics.coloring.foreground')),
    fontSize: pressableButtonFontSize,
    fontWeight: pressableButtonFontWeight,
    fontFamily: pressableButtonFontFamily,
    lineHeight: pressableButtonLineHeight,
  },
} as const
