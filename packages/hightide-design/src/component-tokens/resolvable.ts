import type { ColorToken } from '../primitive-tokens/color'

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

export type ResolvableNumber<T extends number, P extends string = string> =
  | { type?: undefined, value: T }
  | { type: 'variable', path: P }
  | { type: 'parameter', path: P, fallback: ResolvableNumber<T, P> }
  | {
    type: 'calculation',
    operation: NumberCalculationOperation,
    value1: ResolvableNumber<T, P>,
    value2: ResolvableNumber<T, P>,
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
    amount: ResolvableNumber<number, NumberPath>,
  }
  | {
    type: 'color',
    operation: 'lightness',
    color: ResolvableColor<ColorPath, NumberPath>,
    amount: ResolvableNumber<number, NumberPath>,
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

export type Resolvable<T, NumberPath extends string, ColorPath extends string, StringPath extends string = string> =
  T extends number
    ? ResolvableNumber<number, NumberPath>
    : T extends ColorToken
      ? ResolvableColor<ColorPath, NumberPath>
      : T extends string
        ? ResolvableString<StringPath>
        : T extends ReadonlyArray<infer U>
          ? ReadonlyArray<Resolvable<U, NumberPath, ColorPath, StringPath>>
          : T extends object
            ? (
              | { type: 'variable', path: string }
              | { type: 'parameter', path: string, fallback: Resolvable<T, NumberPath, ColorPath, StringPath> }
              | { [K in keyof T]: Resolvable<T[K], NumberPath, ColorPath, StringPath> }
            )
            : T
