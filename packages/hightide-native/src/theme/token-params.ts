import type { ResolverParams } from '@helpwave/hightide-design/primitive-tokens'
import { TokenBuilder } from '@helpwave/hightide-design/utils'
import type { HexColor } from './types/color'

export type TokenContextParams = {
  colors?: Record<string, HexColor | undefined>,
  numbers?: Record<string, number | undefined>,
}

export const wrapColor = (color: HexColor) => TokenBuilder.colorValue(TokenBuilder.color(color))

export const wrapNumber = (value: number) => TokenBuilder.numberValue(TokenBuilder.number(value))

const wrapRecord = <T, TWrapped>(
  record: Record<string, T | undefined> | undefined,
  wrap: (value: T) => TWrapped
): Record<string, TWrapped | undefined> | undefined => {
  if (record === undefined) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      value === undefined ? undefined : wrap(value),
    ])
  )
}

export const wrapParams = (params?: TokenContextParams): ResolverParams | undefined => {
  if (params === undefined) {
    return undefined
  }

  return {
    colors: wrapRecord(params.colors, wrapColor),
    numbers: wrapRecord(params.numbers, wrapNumber),
  }
}
