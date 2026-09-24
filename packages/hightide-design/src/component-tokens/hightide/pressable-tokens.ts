import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import {
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize
} from '../../semantic-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens, OutlineTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextTokens } from '../text-tokens'
import type { PressableButtonTokenParams } from './pressable-button-params'
import {
  pressableButtonBorderRadius,
  pressableButtonFontFamily,
  pressableButtonFontSize,
  pressableButtonFontWeight,
  pressableButtonCenteredLayout,
  pressableButtonIconSize,
  pressableButtonIconStrokeWidth,
  pressableButtonLineHeight,
  pressableButtonMinHeightSize,
  pressablePadding
} from './pressable-button-shared-tokens'
import type { HightideTokenPathProvider } from './token-context'

export const pressableStateValues = [
  'disabled',
  'focused',
  'focusVisible',
  'hovered',
  'pressed',
] as const

export type PressableStateValue = typeof pressableStateValues[number]

export type PressableState = AssertAssignable<
  PressableStateValue | 'outlined' | 'additionalHorizontalPadding',
  ResolverState
>
export type PressableConfig = HightideResolverConfig

export const pressableStateValueSet: ReadonlySet<PressableStateValue> = new Set(pressableStateValues)

export const isPressableStateValue = (value: string): value is PressableStateValue => (
  pressableStateValueSet.has(value as PressableStateValue)
)

export const toPressableState = (state: ReadonlySet<string>): ReadonlySet<PressableStateValue> => {
  const active = new Set<PressableStateValue>()
  for (const value of state) {
    if (isPressableStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export type PressableParams = AssertAssignable<PressableButtonTokenParams, HightideResolverParams>
export type PressableTokenContext = HightideTokenPathProvider<PressableParams>

export type PressableComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: ColoringStyle,
    coloringColorVariant?: ColoringColorVariant,
    hasAdditionalHorizontalPadding?: boolean,
  },
  state: ReadonlySet<PressableStateValue>,
}

export type PressableTokens = AssertAssignable<{
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextTokens,
}, ComponentTokens<PressableConfig>>

export type PressableOverrideTokens = Partial<PressableTokens> & {
  overrides?: PressableComponentResolverProps['overrides'],
}

export type PressableTokenResolver = ComponentTokenResolver<
  PressableComponentResolverProps,
  PressableTokens
>

export const pressableTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<PressableTokenContext>('semantics.color.coloring.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    outline: TokenBuilder.stateful<OutlineTokens>(
      {
        width: TokenBuilder.numberValue(TokenBuilder.number(0)),
        offset: TokenBuilder.numberValue(TokenBuilder.number(0)),
        style: TokenBuilder.outlineStyle('solid'),
        color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
      },
      [
        TokenBuilder.whenState(['outlined', 'focusVisible'], {
          width: TokenBuilder.numberRef<PressableTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<PressableTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<PressableTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorValueRef<PressableTokenContext>('semantics.color.coloring.outline'),
        }),
      ]
    ),
    size: pressableButtonMinHeightSize,
    borderRadius: pressableButtonBorderRadius,
    padding: pressablePadding,
    layout: pressableButtonCenteredLayout,
  },
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<PressableTokenContext>('semantics.color.stateLayerTint')),
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
      right: TokenBuilder.numberValue(TokenBuilder.number(0)),
      bottom: TokenBuilder.numberValue(TokenBuilder.number(0)),
      left: TokenBuilder.numberValue(TokenBuilder.number(0)),
      zIndex: TokenBuilder.numberValue(TokenBuilder.number(20)),
    }),
    borderRadius: pressableButtonBorderRadius,
  },
  icon: {
    type: 'icon',
    size: pressableButtonIconSize,
    strokeWidth: pressableButtonIconStrokeWidth,
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<PressableTokenContext>('semantics.color.coloring.foreground')),
  },
  text: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<PressableTokenContext>('semantics.color.coloring.foreground')),
    fontSize: pressableButtonFontSize,
    fontWeight: pressableButtonFontWeight,
    fontFamily: pressableButtonFontFamily,
    lineHeight: pressableButtonLineHeight,
  },
} as const
