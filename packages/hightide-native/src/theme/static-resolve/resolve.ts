import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { NumberCalculationOperation } from '@helpwave/hightide-design/component-tokens'
import type { StateBasedTokenProperty } from '@helpwave/hightide-design/component-tokens'
import { HexColorUtils, OKLCHUtils } from '@helpwave/hightide-design/utils'
import {
  matchesNegativeStateConditions,
  matchesStateConditions
} from '@helpwave/hightide-design/theme-tokens'

export type TokenResolveContext = {
  theme: object,
  semantic?: object,
  params?: object,
}

const getAtPath = (value: unknown, path: string): unknown => {
  const keys = path.split('.')
  let current: unknown = value

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      throw new Error(`Token path not found: ${path}`)
    }

    current = (current as Record<string, unknown>)[key]
  }

  if (current === undefined) {
    throw new Error(`Token path not found: ${path}`)
  }

  return current
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

const asNumber = (value: unknown, label: string): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Expected number for ${label}, received ${String(value)}`)
  }

  return value
}

const asHexColor = (value: unknown, label: string): HexColorToken => {
  if (value === 'transparent') {
    return HexColorUtils.resolveColorToken(value)
  }

  if (typeof value !== 'string' || !value.startsWith('#')) {
    throw new Error(`Expected color for ${label}, received ${String(value)}`)
  }

  return HexColorUtils.resolveColorToken(value as ColorToken)
}

const resolveCalculation = (
  operation: NumberCalculationOperation,
  value1: number,
  value2: number
): number => {
  switch (operation) {
  case 'add':
    return value1 + value2
  case 'subtract':
    return value1 - value2
  case 'multiply':
    return value1 * value2
  case 'divide':
    return value2 === 0 ? 0 : value1 / value2
  case 'min':
    return Math.min(value1, value2)
  case 'max':
    return Math.max(value1, value2)
  case 'floor':
    return Math.floor(value1)
  case 'round':
    return Math.round(value1)
  case 'ceil':
    return Math.ceil(value1)
  }
}

const resolveStateBasedTokenProperty = <S extends string, V>(
  property: StateBasedTokenProperty<S, V>,
  activeStates: ReadonlySet<S>
): V => {
  let result = property.base

  for (const override of property.overrides ?? []) {
    if (
      matchesStateConditions(activeStates, override.condition)
      && matchesNegativeStateConditions(activeStates, override.negativeCondition)
    ) {
      result = override.value
    }
  }

  return result
}

export const resolveResolvableValue = (
  value: unknown,
  context: TokenResolveContext
): unknown => {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveResolvableValue(item, context))
  }

  if (!isRecord(value)) {
    return value
  }

  const type = value.type

  if (type === 'variable') {
    if (typeof value.path !== 'string') {
      throw new Error('Variable resolvable is missing a string path')
    }

    return getAtPath(context, value.path)
  }

  if (type === 'calculation') {
    const operation = value.operation as NumberCalculationOperation
    const value1 = asNumber(resolveResolvableValue(value.value1, context), 'calculation.value1')
    const value2 = asNumber(resolveResolvableValue(value.value2, context), 'calculation.value2')

    return resolveCalculation(operation, value1, value2)
  }

  if (type === 'color') {
    const operation = value.operation

    if (operation === 'opacity') {
      const color = asHexColor(resolveResolvableValue(value.color, context), 'color.opacity')
      const amount = asNumber(resolveResolvableValue(value.amount, context), 'color.opacity.amount')

      return HexColorUtils.hexWithAlpha(color, amount)
    }

    if (operation === 'lightness') {
      const color = asHexColor(resolveResolvableValue(value.color, context), 'color.lightness')
      const amount = asNumber(resolveResolvableValue(value.amount, context), 'color.lightness.amount')

      return OKLCHUtils.changeLightness(color, amount)
    }

    if (operation === 'blend') {
      const background = asHexColor(
        resolveResolvableValue(value.background, context),
        'color.blend.background'
      )
      const tint = asHexColor(resolveResolvableValue(value.tint, context), 'color.blend.tint')

      return HexColorUtils.blend(background, tint)
    }

    throw new Error(`Unknown color operation: ${String(operation)}`)
  }

  if (type === undefined && 'value' in value) {
    return value.value
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = resolveResolvableValue(value[key], context)
  }

  return result
}

const isStateBasedTokenProperty = (value: unknown): value is StateBasedTokenProperty<string, unknown> => (
  isRecord(value)
  && 'base' in value
  && !('type' in value)
  && !('path' in value)
  && !('operation' in value)
)

export const resolveConfigNode = (
  value: unknown,
  state: ReadonlySet<string>,
  context: TokenResolveContext
): unknown => {
  if (isStateBasedTokenProperty(value)) {
    return resolveResolvableValue(
      resolveStateBasedTokenProperty(value, state),
      context
    )
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveConfigNode(item, state, context))
  }

  if (!isRecord(value)) {
    return resolveResolvableValue(value, context)
  }

  if (
    value.type === 'variable'
    || value.type === 'calculation'
    || value.type === 'color'
    || (value.type === undefined && 'value' in value)
  ) {
    return resolveResolvableValue(value, context)
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = resolveConfigNode(value[key], state, context)
  }

  return result
}

export const resolveTokenConfig = <T>(
  config: unknown,
  state: ReadonlySet<string>,
  context: TokenResolveContext
): T => resolveConfigNode(config, state, context) as T
