import type { ContextBasedProperty, ContextBasedPropertyOverride } from '../component-tokens/context-based'
import type { HightideTokenPathProvider } from '../component-tokens/hightide/token-context'
import type { AxisAlignmentToken, AxisAlignmentValue } from '../primitive-tokens/axis-alignment-token'
import type { BorderStyleToken, BorderStyleValue } from '../primitive-tokens/border-style-token'
import type { ColorOpToken } from '../primitive-tokens/color-op'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { CrossAxisAlignmentToken, CrossAxisAlignmentValue } from '../primitive-tokens/cross-axis-alignment-token'
import type { CrossAxisLineAlignmentToken, CrossAxisLineAlignmentValue } from '../primitive-tokens/cross-axis-line-alignment-token'
import type { FlexWrapToken, FlexWrapValue } from '../primitive-tokens/flex-wrap-token'
import type { FontFamilyToken } from '../primitive-tokens/font-family-token'
import type { FontWeight, FontWeightToken } from '../primitive-tokens/font-weight-token'
import type { LayoutDirectionToken, LayoutDirectionValue } from '../primitive-tokens/layout-direction-token'
import type { MainAxisAlignmentToken, MainAxisAlignmentValue } from '../primitive-tokens/main-axis-alignment-token'
import type {
  NumberBinaryCalculationOperation,
  NumberCalcToken,
  NumberUnaryCalculationOperation
} from '../primitive-tokens/number-calc'
import type { NumberToken } from '../primitive-tokens/number-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { OutlineStyleToken, OutlineStyleValue } from '../primitive-tokens/outline-style-token'
import type { OverflowToken, OverflowValue } from '../primitive-tokens/overflow-token'
import type { PercentToken } from '../primitive-tokens/percent-token'
import type { HightideResolverConfig, ResolverState } from '../primitive-tokens/resolver-types'
import type { SpacingAlignmentToken, SpacingAlignmentValue } from '../primitive-tokens/spacing-alignment-token'
import type { StretchToken, StretchValue } from '../primitive-tokens/stretch-token'
import type { TextAlignToken, TextAlignValue } from '../primitive-tokens/text-align-token'
import type {
  AxisFlow,
  WritingOrientation } from './box-sides'
import {
  type BoxCornersInput,
  type BoxSidesInput,
  type PhysicalBoxCorners,
  type PhysicalBoxSides,
  type WritingConfig,
  isDefaultWritingConfig,
  resolveBoxCorners,
  resolveBoxSides,
  writingConfigCombinations
} from './box-sides'
import type { HexColor } from './hex-color'
import type { Token, TokenRef, TokenRefOrValue, TokenRefPath } from './token-type'
import type { ColorToken } from '../primitive-tokens'
import type { ThemeLayoutSize } from '../theme-tokens/create'

type WidenTokenLeaves<T> =
  T extends TokenRef<infer U extends Token> ? TokenRefOrValue<U>
    : T extends Token ? TokenRefOrValue<T>
      : T extends object ? { [K in keyof T]: WidenTokenLeaves<T[K]> }
        : T

const number = (value: number): NumberToken => ({
  type: 'number',
  value,
})

const toNumberValue = (
  value: NumberValueToken | TokenRef<NumberValueToken>
): NumberValueToken | TokenRef<NumberValueToken> => (
  value.type === 'numberValue' || value.type === 'ref.numberValue'
    ? value
    : { type: 'numberValue', value }
)

const numberValue = (
  value: NumberToken | NumberCalcToken
): NumberValueToken => ({
  type: 'numberValue',
  value,
})

const numberRef = <Path = HightideTokenPathProvider>(
  path: TokenRefPath<NumberValueToken, Path>,
  fallback?:  TokenRefOrValue<NumberValueToken>
): TokenRef<NumberValueToken> => ({
    type: 'ref.numberValue',
    path,
    fallback,
  })

const calc = (
  operation: NumberBinaryCalculationOperation,
  value1: TokenRefOrValue<NumberValueToken>,
  value2: TokenRefOrValue<NumberValueToken>
): NumberValueToken => numberValue({
  type: 'numberCalc',
  value: {
    operation,
    value1,
    value2,
  },
})

const unaryCalc = (
  operation: NumberUnaryCalculationOperation,
  value: TokenRefOrValue<NumberValueToken>
): NumberValueToken => numberValue({
  type: 'numberCalc',
  value: {
    operation,
    value,
  },
})

const floor = (value: TokenRefOrValue<NumberValueToken>): NumberValueToken => unaryCalc('floor', value)

const round = (value: TokenRefOrValue<NumberValueToken>): NumberValueToken => unaryCalc('round', value)

const ceil = (value: TokenRefOrValue<NumberValueToken>): NumberValueToken => unaryCalc('ceil', value)

const color = (
  value: HexColor
): ColorToken => ({
  type: 'color',
  value,
})

const colorRef = <Path = HightideTokenPathProvider>(
  path: NoInfer<TokenRefPath<ColorToken, Path>>,
  fallback?: TokenRefOrValue<ColorToken>
): TokenRef<ColorToken> => ({
    type: 'ref.color',
    path,
    fallback,
  })

const toColorValue = (
  value: ColorValueToken | TokenRef<ColorValueToken>
): ColorValueToken | TokenRef<ColorValueToken> => (
  value.type === 'colorValue' || value.type === 'ref.colorValue'
    ? value
    : { type: 'colorValue', value }
)

const colorValueToken = (
  value: TokenRefOrValue<ColorToken | ColorOpToken>
): ColorValueToken => ({
  type: 'colorValue',
  value,
})

const colorValueRef = <Path = HightideTokenPathProvider>(
  path: TokenRefPath<ColorValueToken, Path>,
  fallback?: TokenRefOrValue<ColorValueToken>
): TokenRef<ColorValueToken> => ({
    type: 'ref.colorValue',
    path,
    fallback,
  })

const colorOpacity = (
  colorArg: ColorValueToken | TokenRef<ColorValueToken>,
  amount: NumberValueToken | TokenRef<NumberValueToken>
): ColorValueToken => colorValueToken({
  type: 'colorOp',
  value: {
    operation: 'opacity',
    color: toColorValue(colorArg),
    amount: toNumberValue(amount),
  },
})

const colorLightness = (
  colorArg: ColorValueToken | TokenRef<ColorValueToken>,
  amount: NumberValueToken | TokenRef<NumberValueToken>
): ColorValueToken => colorValueToken({
  type: 'colorOp',
  value: {
    operation: 'lightness',
    color: toColorValue(colorArg),
    amount: toNumberValue(amount),
  },
})

const colorBlend = (
  background: ColorValueToken | TokenRef<ColorValueToken>,
  tint: ColorValueToken | TokenRef<ColorValueToken>
): ColorValueToken => colorValueToken({
  type: 'colorOp',
  value: {
    operation: 'blend',
    background: toColorValue(background),
    tint: toColorValue(tint),
  },
})

const fontFamily = (value: string): FontFamilyToken => ({
  type: 'fontFamily',
  value,
})

const fontWeight = (value: FontWeight): FontWeightToken => ({
  type: 'fontWeight',
  value,
})

const fontFamilyRef = <Path = HightideTokenPathProvider>(
  path: NoInfer<TokenRefPath<FontFamilyToken, Path>>,
  fallback?: TokenRefOrValue<FontFamilyToken>
): TokenRef<FontFamilyToken> => ({
    type: 'ref.fontFamily',
    path,
    fallback,
  })

const outlineStyle = (value: OutlineStyleValue): OutlineStyleToken => ({
  type: 'outlineStyle',
  value,
})

const outlineStyleRef = <Path = HightideTokenPathProvider>(
  path: NoInfer<TokenRefPath<OutlineStyleToken, Path>>,
  fallback?: TokenRefOrValue<OutlineStyleToken>
): TokenRef<OutlineStyleToken> => ({
    type: 'ref.outlineStyle',
    path,
    fallback,
  })


const overflow = (value: OverflowValue): OverflowToken => ({
  type: 'overflow',
  value,
})

const layoutDirection = (value: LayoutDirectionValue): LayoutDirectionToken => ({
  type: 'layoutDirection',
  value,
})

const axisAlignment = (value: AxisAlignmentValue): AxisAlignmentToken => ({
  type: 'axisAlignment',
  value,
})

const stretch = (value: StretchValue): StretchToken => ({
  type: 'stretch',
  value,
})

const spacingAlignment = (value: SpacingAlignmentValue): SpacingAlignmentToken => ({
  type: 'spacingAlignment',
  value,
})

const mainAxisAlignment = (value: MainAxisAlignmentValue): MainAxisAlignmentToken => ({
  type: 'mainAxisAlignment',
  value,
})

const crossAxisAlignment = (value: CrossAxisAlignmentValue): CrossAxisAlignmentToken => ({
  type: 'crossAxisAlignment',
  value,
})

const crossAxisLineAlignment = (value: CrossAxisLineAlignmentValue): CrossAxisLineAlignmentToken => ({
  type: 'crossAxisLineAlignment',
  value,
})

const flexWrap = (value: FlexWrapValue): FlexWrapToken => ({
  type: 'flexWrap',
  value,
})

const borderStyle = (value: BorderStyleValue): BorderStyleToken => ({
  type: 'borderStyle',
  value,
})

const textAlign = (value: TextAlignValue): TextAlignToken => ({
  type: 'textAlign',
  value,
})

const percent = (value: `${number}%`): PercentToken => ({
  type: 'percent',
  value,
})

const stateful = <
  V,
  S extends ResolverState = ResolverState
>(
    base?: V,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<WidenTokenLeaves<NoInfer<V>> | undefined, S, HightideResolverConfig>>
  ): ContextBasedProperty<WidenTokenLeaves<V>, S, HightideResolverConfig> => ({
    base: base as WidenTokenLeaves<V> | undefined,
    overrides: overrides as ContextBasedProperty<WidenTokenLeaves<V>, S, HightideResolverConfig>['overrides'],
  })

const statefulField = <
  T extends Token,
  S extends ResolverState = ResolverState,
  C extends HightideResolverConfig = HightideResolverConfig
>(
    base: TokenRefOrValue<T>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<TokenRefOrValue<T>, S, C>>
  ): ContextBasedProperty<TokenRefOrValue<T>, S, C> => ({
    base,
    overrides,
  })

const toStateSet = <S extends string>(
  value: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlySet<S> => (value instanceof Set ? value : new Set(value))

const whenState = <
  V,
  S extends ResolverState
>(
    condition: ReadonlyArray<S> | ReadonlySet<S>,
    value: V,
    negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>,
    configCondition?: Partial<HightideResolverConfig>
  ): ContextBasedPropertyOverride<V, S, HightideResolverConfig> => ({
    condition: toStateSet(condition),
    negativeCondition: negativeCondition === undefined
      ? undefined
      : toStateSet(negativeCondition),
    configCondition,
    value,
  })

const whenConfig = <
  V,
  Config extends HightideResolverConfig = HightideResolverConfig,
  State extends ResolverState = ResolverState
>(
    configCondition: Partial<Config>,
    value: V
  ): ContextBasedPropertyOverride<V, State, Config> => ({
    configCondition,
    value,
  })

const themeLayoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ThemeLayoutSize[]

const whenThemeSize = <V>(
  valueForSize: (size: ThemeLayoutSize) => V
): ReadonlyArray<ContextBasedPropertyOverride<V, ResolverState, HightideResolverConfig>> => (
    themeLayoutSizes
      .filter((size) => size !== 'md')
      .map((size) => whenConfig({ size }, valueForSize(size)))
  )

const whenThemeSizeState = <S extends ResolverState, V>(
  condition: ReadonlyArray<S> | ReadonlySet<S>,
  valueForSize: (size: ThemeLayoutSize) => V,
  negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlyArray<ContextBasedPropertyOverride<V, S, HightideResolverConfig>> => (
    themeLayoutSizes.map((size) => whenState(
      condition,
      valueForSize(size),
      negativeCondition,
      { size }
    ))
  )

const writingConfigCondition = (config: WritingConfig): Partial<HightideResolverConfig> => ({
  'writing-orientation': config['writing-orientation'],
  'writing-inline': config.inline,
  'writing-block': config.block,
})

const writingModeOverrides = <
  V,
  S extends ResolverState = ResolverState
>(
    valueForConfig: (config: WritingConfig) => V
  ): ReadonlyArray<ContextBasedPropertyOverride<V, S, HightideResolverConfig>> => {
  return writingConfigCombinations
    .filter((config) => !isDefaultWritingConfig(config))
    .map((config) => whenConfig(writingConfigCondition(config), valueForConfig(config)))
}

const sides = <V>(
  input: BoxSidesInput<V>,
  orientation?: WritingOrientation,
  inline?: AxisFlow,
  block?: AxisFlow
): PhysicalBoxSides<V> => resolveBoxSides(input, orientation, inline, block)

const corners = <V>(
  input: BoxCornersInput<V>,
  orientation?: WritingOrientation,
  inline?: AxisFlow,
  block?: AxisFlow
): PhysicalBoxCorners<V> => resolveBoxCorners(input, orientation, inline, block)

const padding = <
  S extends ResolverState = ResolverState
>(
    input: BoxSidesInput<TokenRefOrValue<NumberValueToken>>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig>>
  ): ContextBasedProperty<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig> => stateful<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S>(
    resolveBoxSides(input),
    [
      ...writingModeOverrides<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S>(
        (config) => resolveBoxSides(
          input,
          config['writing-orientation'],
          config.inline,
          config.block
        )
      ),
      ...(overrides ?? []),
    ]
  )

const margin = <
  S extends ResolverState = ResolverState
>(
    input: BoxSidesInput<TokenRefOrValue<NumberValueToken>>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig>>
  ): ContextBasedProperty<PhysicalBoxSides<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig> => padding(input, overrides)

const borderRadius = <
  S extends ResolverState = ResolverState
>(
    input: BoxCornersInput<TokenRefOrValue<NumberValueToken>>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<PhysicalBoxCorners<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig>>
  ): ContextBasedProperty<PhysicalBoxCorners<TokenRefOrValue<NumberValueToken>>, S, HightideResolverConfig> => stateful<PhysicalBoxCorners<TokenRefOrValue<NumberValueToken>>, S>(
    resolveBoxCorners(input),
    [
      ...writingModeOverrides<PhysicalBoxCorners<TokenRefOrValue<NumberValueToken>>, S>(
        (config) => resolveBoxCorners(
          input,
          config['writing-orientation'],
          config.inline,
          config.block
        )
      ),
      ...(overrides ?? []),
    ]
  )

export const TokenBuilder = {
  number,
  numberValue,
  numberRef,
  calc,
  floor,
  round,
  ceil,
  color,
  colorRef,
  colorValue: colorValueToken,
  colorValueRef,
  colorOpacity,
  colorLightness,
  colorBlend,
  fontFamily,
  fontFamilyRef,
  fontWeight,
  outlineStyle,
  outlineStyleRef,
  overflow,
  layoutDirection,
  axisAlignment,
  stretch,
  spacingAlignment,
  mainAxisAlignment,
  crossAxisAlignment,
  crossAxisLineAlignment,
  flexWrap,
  borderStyle,
  textAlign,
  percent,
  stateful,
  statefulField,
  whenState,
  whenConfig,
  whenThemeSize,
  whenThemeSizeState,
  sides,
  corners,
  padding,
  margin,
  borderRadius,
}
