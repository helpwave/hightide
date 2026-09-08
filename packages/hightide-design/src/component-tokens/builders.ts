import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeLayoutSize } from '../theme-tokens/theme-tokens-config'
import type { DotPath } from '../utils/path'
import type {
  ContextBasedProperty,
  ContextBasedPropertyOverride
} from './context-based'
import type { PressableButtonTokenParams } from './pressable-button-params'
import type {
  NumberCalculationOperation,
  ResolvableColor,
  ResolvableNumber
} from './resolvable'
import type { TokenContext, TokenPathOf } from './token-context'
import type { ComponentTokenConfigValue } from './token-config'

export const tokenValue = <T>(value: T): { value: T } => ({
  value,
})

export const tokenVariable = <
  Params = unknown,
  P extends TokenPathOf<Params> = TokenPathOf<Params>
>(
    path: P
  ): { type: 'variable', path: P } => ({
    type: 'variable',
    path,
  })

export const createTokenVariable = <Params>() => (
  <P extends TokenPathOf<Params>>(
    path: P
  ): { type: 'variable', path: P } => tokenVariable<Params, P>(path)
)

export const tokenParameter = <
  Params = PressableButtonTokenParams,
  P extends (
    | DotPath<TokenContext<Params>, ColorToken>
    | DotPath<TokenContext<Params>, number>
    | DotPath<TokenContext<Params>, string>
  ) = (
    | DotPath<TokenContext<Params>, ColorToken>
    | DotPath<TokenContext<Params>, number>
    | DotPath<TokenContext<Params>, string>
  ),
  F = unknown
>(
    path: P,
    fallback: F
  ): { type: 'parameter', path: P, fallback: F } => ({
    type: 'parameter',
    path,
    fallback,
  })

export const tokenCalc = <P extends string = string, T extends number = number>(
  operation: NumberCalculationOperation,
  value1: ResolvableNumber<P, T>,
  value2: ResolvableNumber<P, T> = { value: 0 as T }
): ResolvableNumber<P, T> => ({
    type: 'calculation',
    operation,
    value1,
    value2,
  })

export const tokenColorOpacity = <ColorPath extends string, NumberPath extends string>(
  color: ResolvableColor<ColorPath, NumberPath>,
  amount: ResolvableNumber<NumberPath>
): ResolvableColor<ColorPath, NumberPath> => ({
    type: 'color',
    operation: 'opacity',
    color,
    amount,
  })

export const tokenColorLightness = <ColorPath extends string, NumberPath extends string>(
  color: ResolvableColor<ColorPath, NumberPath>,
  amount: ResolvableNumber<NumberPath>
): ResolvableColor<ColorPath, NumberPath> => ({
    type: 'color',
    operation: 'lightness',
    color,
    amount,
  })

export const tokenColorBlend = <ColorPath extends string, NumberPath extends string>(
  background: ResolvableColor<ColorPath, NumberPath>,
  tint: ResolvableColor<ColorPath, NumberPath>
): ResolvableColor<ColorPath, NumberPath> => ({
    type: 'color',
    operation: 'blend',
    background,
    tint,
  })

export const stateful = <
  S extends string,
  V,
  C extends Record<string, string> = Record<string, string>
>(
    base: V,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<S, C, V>>
  ): ContextBasedProperty<S, C, V> => ({
    base,
    overrides,
  })

export const statefulField = <
  T,
  Context = TokenContext<unknown>,
  S extends string = string
>(
    base: ComponentTokenConfigValue<T, Context>,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<S, Record<string, string>, ComponentTokenConfigValue<T, Context>>>
  ): ContextBasedProperty<S, Record<string, string>, ComponentTokenConfigValue<T, Context>> => (
    stateful(base, overrides)
  )

const toStateSet = <S extends string>(
  value: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlySet<S> => (value instanceof Set ? value : new Set(value))

export const whenState = <
  S extends string,
  V,
  C extends Record<string, string> = Record<string, string>
>(
    condition: ReadonlyArray<S> | ReadonlySet<S>,
    value: V,
    negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>,
    configCondition?: Partial<C>
  ): ContextBasedPropertyOverride<S, C, V> => ({
    condition: toStateSet(condition),
    negativeCondition: negativeCondition === undefined
      ? undefined
      : toStateSet(negativeCondition),
    configCondition,
    value,
  })

export const whenConfig = <
  C extends Record<string, string>,
  V,
  S extends string = string
>(
    configCondition: Partial<C>,
    value: V
  ): ContextBasedPropertyOverride<S, C, V> => ({
    configCondition,
    value,
  })

const themeLayoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ThemeLayoutSize[]

export const whenThemeSize = <V>(
  valueForSize: (size: ThemeLayoutSize) => V
): ReadonlyArray<ContextBasedPropertyOverride<string, { size: ThemeLayoutSize }, V>> => (
    themeLayoutSizes
      .filter((size) => size !== 'md')
      .map((size) => whenConfig({ size }, valueForSize(size)))
  )

export const whenThemeSizeState = <S extends string, V>(
  condition: ReadonlyArray<S> | ReadonlySet<S>,
  valueForSize: (size: ThemeLayoutSize) => V,
  negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlyArray<ContextBasedPropertyOverride<S, { size: ThemeLayoutSize }, V>> => (
    themeLayoutSizes.map((size) => whenState(
      condition,
      valueForSize(size),
      negativeCondition,
      { size }
    ))
  )
