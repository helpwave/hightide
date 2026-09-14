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
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
import type { PressableButtonTokenParams } from './pressable-button-params'
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
  container: ResolvableContainerTokens<PressableState, PressableConfig>,
  stateLayer: ResolvableContainerTokens<PressableState, PressableConfig>,
  icon: ResolvableIconTokens<PressableState, PressableConfig>,
  text: ResolvableTextStyleTokens<PressableState, PressableConfig>,
}, ComponentTokens<PressableState, PressableConfig>>

export type PressableOverrideTokens = Partial<PressableTokens> & {
  overrides?: PressableComponentResolverProps['overrides'],
}

export type PressableTokenResolver = ComponentTokenResolver<
  PressableComponentResolverProps,
  PressableTokens
>

export const pressableTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<PressableTokenContext>('semantics.color.coloring.background')),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.6)),
      ]
    ),
    outline: TokenBuilder.stateful(
      {
        width: TokenBuilder.number(0),
        offset: TokenBuilder.number(0),
        style: 'solid',
        color: TokenBuilder.color(HexColorUtils.transparent),
      },
      [
        TokenBuilder.whenState(['outlined', 'focusVisible'], {
          width: TokenBuilder.numberRef<PressableTokenContext>('theme.focusOutline.width'),
          offset: TokenBuilder.numberRef<PressableTokenContext>('theme.focusOutline.offset'),
          style: TokenBuilder.outlineStyleRef<PressableTokenContext>('theme.focusOutline.style'),
          color: TokenBuilder.colorRef<PressableTokenContext>('semantics.color.coloring.outline'),
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
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<PressableTokenContext>('semantics.color.stateLayerTint')),
    position: TokenBuilder.stateful({
      type: 'absolute',
      top: TokenBuilder.number(0),
      right: TokenBuilder.number(0),
      bottom: TokenBuilder.number(0),
      left: TokenBuilder.number(0),
      zIndex: TokenBuilder.number(20),
    }),
    borderRadius: pressableButtonBorderRadius,
  },
  icon: {
    kind: 'icon' as const,
    size: pressableButtonIconSize,
    strokeWidth: pressableButtonIconStrokeWidth,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<PressableTokenContext>('semantics.color.coloring.foreground')),
  },
  text: {
    kind: 'textStyle' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<PressableTokenContext>('semantics.color.coloring.foreground')),
    fontSize: pressableButtonFontSize,
    fontWeight: pressableButtonFontWeight,
    fontFamily: pressableButtonFontFamily,
    lineHeight: pressableButtonLineHeight,
  },
} as const
