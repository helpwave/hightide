import type { ColorToken } from '../primitive-tokens/color'
import type { DotPath } from '../utils/path'

export type NumberCalculationOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'min'
  | 'max'
  | 'floor'
  | 'round'
  | 'ceil'

export type ResolvableNumber<P extends string = string, T extends number = number> =
  | { type?: undefined, value: T }
  | { type: 'variable', path: P }
  | { type: 'parameter', path: P, fallback: ResolvableNumber<P, T> }
  | {
    type: 'calculation',
    operation: NumberCalculationOperation,
    value1: ResolvableNumber<P, T>,
    value2: ResolvableNumber<P, T>,
  }

export type ColorOperation = 'opacity' | 'lightness' | 'blend'

export type ResolvableColor<ColorPath extends string, NumberPath extends string> =
  | { type?: undefined, value: ColorToken }
  | { type: 'variable', path: ColorPath }
  | { type: 'parameter', path: ColorPath, fallback: ResolvableColor<ColorPath, NumberPath> }
  | {
    type: 'color',
    operation: 'opacity',
    color: ResolvableColor<ColorPath, NumberPath>,
    amount: ResolvableNumber<NumberPath>,
  }
  | {
    type: 'color',
    operation: 'lightness',
    color: ResolvableColor<ColorPath, NumberPath>,
    amount: ResolvableNumber<NumberPath>,
  }
  | {
    type: 'color',
    operation: 'blend',
    background: ResolvableColor<ColorPath, NumberPath>,
    tint: ResolvableColor<ColorPath, NumberPath>,
  }

export type ResolvableString<P extends string = string> =
  | string
  | { type: 'variable', path: P }
  | { type: 'parameter', path: P, fallback: ResolvableString<P> }

export type Resolvable<T, Context> =
  T extends number
    ? ResolvableNumber<DotPath<Context, number>, number>
    : T extends ColorToken
      ? ResolvableColor<DotPath<Context, ColorToken>, DotPath<Context, number>>
      : T extends string
        ? ResolvableString<DotPath<Context, string>>
        : never
