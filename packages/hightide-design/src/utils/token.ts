import type { ContextBasedProperty, ContextBasedPropertyOverride } from '../component-tokens/context-based'
import type { HightideTokenPathProvider } from '../component-tokens/token-context'
import type { ComponentTokenConfigValue } from '../component-tokens/token-config'
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
import type { NumberCalcToken, NumberCalculationOperation } from '../primitive-tokens/number-calc'
import type { NumberToken } from '../primitive-tokens/number-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { OutlineStyleToken, OutlineStyleValue } from '../primitive-tokens/outline-style-token'
import type { OverflowToken, OverflowValue } from '../primitive-tokens/overflow-token'
import type { PercentToken } from '../primitive-tokens/percent-token'
import type { ResolverConfig, ResolverState } from '../primitive-tokens/resolver-types'
import type { SpacingAlignmentToken, SpacingAlignmentValue } from '../primitive-tokens/spacing-alignment-token'
import type { StretchToken, StretchValue } from '../primitive-tokens/stretch-token'
import type { TextAlignToken, TextAlignValue } from '../primitive-tokens/text-align-token'
import type { HexColor } from './hex-color'
import type { TokenRef, TokenRefPath } from './token-type'
import type { ColorToken } from '../primitive-tokens'
import type { ThemeLayoutSize } from '../theme-tokens/create'

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
  path: NoInfer<TokenRefPath<NumberValueToken, Path>>,
  fallback?: NumberValueToken['value']
): TokenRef<NumberValueToken> => ({
    type: 'ref.numberValue',
    path,
    fallback,
  })

const calc = (
  operation: NumberCalculationOperation,
  value1: NumberValueToken | TokenRef<NumberValueToken>,
  value2: NumberValueToken | TokenRef<NumberValueToken>
): NumberValueToken => numberValue({
  type: 'numberCalc',
  value: {
    operation,
    value1: toNumberValue(value1),
    value2: toNumberValue(value2),
  },
})

const color = (value: HexColor): ColorToken => ({
  type: 'color',
  value,
})

const toColorValue = (
  value: ColorValueToken | TokenRef<ColorValueToken>
): ColorValueToken | TokenRef<ColorValueToken> => (
  value.type === 'colorValue' || value.type === 'ref.colorValue'
    ? value
    : { type: 'colorValue', value }
)

const colorValueToken = (
  value: ColorToken | ColorOpToken
): ColorValueToken => ({
  type: 'colorValue',
  value,
})

const colorRef = <Path = HightideTokenPathProvider>(
  path: NoInfer<TokenRefPath<ColorValueToken, Path>>,
  fallback?: ColorValueToken['value']
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
  fallback?: FontFamilyToken['value']
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
  fallback?: OutlineStyleToken['value']
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
    base: V,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<V, S, ResolverConfig>>
  ): ContextBasedProperty<V, S, ResolverConfig> => ({
    base: base as V,
    overrides,
  })

const statefulField = <
  T,
  Context = HightideTokenPathProvider,
  S extends ResolverState = ResolverState
>(
    base: ComponentTokenConfigValue<T, Context>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<ComponentTokenConfigValue<T, Context>, S, ResolverConfig>>
  ): ContextBasedProperty<ComponentTokenConfigValue<T, Context>, S, ResolverConfig> => ({
    base,
    overrides,
  })

const toStateSet = <S extends string>(
  value: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlySet<S> => (value instanceof Set ? value : new Set(value))

const whenState = <
  S extends ResolverState,
  V
>(
    condition: ReadonlyArray<S> | ReadonlySet<S>,
    value: V,
    negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>,
    configCondition?: Partial<ResolverConfig>
  ): ContextBasedPropertyOverride<V, S, ResolverConfig> => ({
    condition: toStateSet(condition),
    negativeCondition: negativeCondition === undefined
      ? undefined
      : toStateSet(negativeCondition),
    configCondition,
    value,
  })

const whenConfig = <V>(
  configCondition: Partial<ResolverConfig>,
  value: V
): ContextBasedPropertyOverride<V, ResolverState, ResolverConfig> => ({
    configCondition,
    value,
  })

const themeLayoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ThemeLayoutSize[]

const whenThemeSize = <V>(
  valueForSize: (size: ThemeLayoutSize) => V
): ReadonlyArray<ContextBasedPropertyOverride<V, ResolverState, ResolverConfig>> => (
    themeLayoutSizes
      .filter((size) => size !== 'md')
      .map((size) => whenConfig({ size }, valueForSize(size)))
  )

const whenThemeSizeState = <S extends ResolverState, V>(
  condition: ReadonlyArray<S> | ReadonlySet<S>,
  valueForSize: (size: ThemeLayoutSize) => V,
  negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlyArray<ContextBasedPropertyOverride<V, S, ResolverConfig>> => (
    themeLayoutSizes.map((size) => whenState(
      condition,
      valueForSize(size),
      negativeCondition,
      { size }
    ))
  )

export const TokenBuilder = {
  number,
  numberValue,
  numberRef,
  calc,
  color,
  colorToken: color,
  colorValue: colorValueToken,
  colorRef,
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
}
