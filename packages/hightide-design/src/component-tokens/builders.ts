import type { ColorToken } from '../primitive-tokens/color'
import type {
  NumberCalculationOperation,
  ResolvableColor,
  ResolvableNumber
} from './resolvable'
import type { StateBasedTokenProperty, StateBasedTokenPropertyOverride } from './state-based'

export const tokenValue = <T>(value: T): { value: T } => ({
  value,
})

export const tokenPath = <P extends string>(path: P): { type: 'variable', path: string } => ({
  type: 'variable',
  path,
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

export const stateful = <S extends string>(
  base: unknown,
  overrides?: ReadonlyArray<StateBasedTokenPropertyOverride<S, unknown>>
): StateBasedTokenProperty<S, unknown> => ({
    base,
    overrides,
  })

export const whenState = <S extends string, V>(
  condition: ReadonlyArray<S> | ReadonlySet<S>,
  value: V,
  negativeCondition?: ReadonlyArray<S> | ReadonlySet<S>
): StateBasedTokenPropertyOverride<S, V> => ({
    condition: condition instanceof Set ? condition : new Set(condition),
    negativeCondition: negativeCondition === undefined
      ? undefined
      : negativeCondition instanceof Set
        ? negativeCondition
        : new Set(negativeCondition),
    value,
  })

export const transparentColor = (): { value: ColorToken } => ({
  value: 'transparent',
})
