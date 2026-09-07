import {
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenParameter,
  tokenValue,
  tokenVariable,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { Resolvable } from './resolvable'
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

const layoutSize = tokenParameter('params.layout.size', tokenVariable('theme.size.md'))
const layoutInset = tokenParameter('params.layout.inset', tokenVariable('theme.padding.md'))
const layoutBorderRadius = tokenParameter(
  'params.layout.borderRadius',
  tokenVariable('theme.borderRadius.md')
)
const layoutHorizontalContentPadding = tokenParameter(
  'params.layout.horizontalContentPadding',
  tokenVariable('theme.padding.md')
)
const tint = tokenParameter('params.tint', { value: HexColorUtils.transparent })
const textFontSize = tokenParameter(
  'params.textStyle.fontSize',
  tokenVariable('theme.typography.label.md.fontSize')
)
const textFontWeight = tokenParameter(
  'params.textStyle.fontWeight',
  tokenVariable('theme.typography.label.md.fontWeight')
)
const textFontFamily = tokenParameter(
  'params.textStyle.fontFamily',
  tokenVariable('theme.typography.label.md.fontFamily')
)
const textLineHeight = tokenParameter(
  'params.textStyle.lineHeight',
  tokenVariable('theme.typography.label.md.lineHeight')
)
const iconSize = tokenParameter('params.iconSize', tokenVariable('theme.icongraphy.sizes.md'))
const iconStrokeWidth = tokenParameter(
  'params.iconStrokeWidth',
  tokenVariable('theme.icongraphy.strokeWidth')
)
const gap = tokenParameter('params.gap', tokenVariable('theme.spacing.md'))

export const pressableTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('semantics.pressableColoring.background')),
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
          color: tokenVariable('semantics.pressableColoring.outline'),
        }),
      ]
    ),
    size: stateful({
      minHeight: layoutSize,
    }),
    borderRadius: stateful({
      type: 'all',
      value: layoutBorderRadius,
    }),
    padding: stateful(
      {
        type: 'physicalAxis',
        vertical: layoutInset,
        horizontal: layoutInset,
      },
      [
        whenState(['additionalHorizontalPadding'], {
          type: 'physicalAxis',
          vertical: layoutInset,
          horizontal: layoutHorizontalContentPadding,
        }),
      ]
    ),
    layout: stateful({
      gap,
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  stateLayer: {
    backgroundColor: stateful(tint),
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
      value: layoutBorderRadius,
    }),
  },
  icon: {
    size: stateful(iconSize),
    strokeWidth: stateful(iconStrokeWidth),
    color: stateful(tokenVariable('semantics.pressableColoring.foreground')),
  },
  text: {
    color: stateful(tokenVariable('semantics.pressableColoring.foreground')),
    fontSize: stateful(textFontSize),
    fontWeight: stateful(textFontWeight),
    fontFamily: stateful(textFontFamily),
    lineHeight: stateful(textLineHeight),
  },
} as const
