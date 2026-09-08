import type { ThemeLayoutSize } from '../theme-tokens/theme-tokens-config'
import type {
  ContextBasedProperty,
  ContextBasedPropertyOverride
} from './context-based'
import type {
  NumberCalculationOperation,
  ResolvableColor,
  ResolvableNumber
} from './resolvable'
import type { PressableButtonParameterPath, TokenVariablePath } from './token-paths'

export const tokenValue = <T>(value: T): { value: T } => ({
  value,
})

export const tokenPath = (path: string): { type: 'variable', path: string } => ({
  type: 'variable',
  path,
})

export const tokenVariable = <P extends TokenVariablePath>(
  path: P
): { type: 'variable', path: TokenVariablePath } => ({
    type: 'variable',
    path,
  })

export const tokenParameter = <P extends PressableButtonParameterPath, F>(
  path: P,
  fallback: F
): { type: 'parameter', path: PressableButtonParameterPath, fallback: F } => ({
    type: 'parameter',
    path,
    fallback,
  })

export const tokenCalc = <T extends number, P extends string>(
  operation: NumberCalculationOperation,
  value1: ResolvableNumber<T, P>,
  value2: ResolvableNumber<T, P> = { value: 0 as T }
): ResolvableNumber<T, P> => ({
    type: 'calculation',
    operation,
    value1,
    value2,
  })

export const tokenColorOpacity = <ColorPath extends string, NumberPath extends string>(
  color: ResolvableColor<ColorPath, NumberPath>,
  amount: ResolvableNumber<number, NumberPath>
): ResolvableColor<ColorPath, NumberPath> => ({
    type: 'color',
    operation: 'opacity',
    color,
    amount,
  })

export const tokenColorLightness = <ColorPath extends string, NumberPath extends string>(
  color: ResolvableColor<ColorPath, NumberPath>,
  amount: ResolvableNumber<number, NumberPath>
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
  C extends Record<string, string> = Record<string, never>
>(
    base: V,
    overrides?: ReadonlyArray<ContextBasedPropertyOverride<S, C, V>>
  ): ContextBasedProperty<S, C, V> => ({
    base,
    overrides,
  })

const toStateSet = <S extends string>(
  value: ReadonlyArray<S> | ReadonlySet<S>
): ReadonlySet<S> => (value instanceof Set ? value : new Set(value))

export const whenState = <
  S extends string,
  V,
  C extends Record<string, string> = Record<string, never>
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