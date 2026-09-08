import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type {
  ComponentTokenConfig,
  ContainerTokens,
  ContextBasedProperty,
  IconTokens,
  NumberCalculationOperation,
  TextStyleTokens,
  TokenContext
} from '@helpwave/hightide-design/component-tokens'
import { matchesConfigCondition } from '@helpwave/hightide-design/component-tokens'
import { HexColorUtils, OKLCHUtils } from '@helpwave/hightide-design/utils'
import {
  matchesNegativeStateConditions,
  matchesStateConditions
} from '@helpwave/hightide-design/theme-tokens'

export type TokenResolveContext = {
  theme: object,
  semantics?: object,
  params?: object,
  config?: Record<string, string>,
  state?: ReadonlySet<string>,
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

const tryGetAtPath = (value: unknown, path: string): unknown => {
  if (path.length === 0) {
    return value
  }

  const keys = path.split('.')
  let current: unknown = value

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }

    current = (current as Record<string, unknown>)[key]
  }

  return current
}

const getAtPath = (value: unknown, path: string): unknown => {
  const current = tryGetAtPath(value, path)

  if (current === undefined) {
    throw new Error(`Token path not found: ${path}`)
  }

  return current
}

const setAtPath = (target: Record<string, unknown>, path: string, value: unknown): void => {
  const keys = path.split('.')
  let current: Record<string, unknown> = target

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]
    if (key === undefined) {
      return
    }

    const next = current[key]
    if (!isRecord(next)) {
      const created: Record<string, unknown> = {}
      current[key] = created
      current = created
    } else {
      current = next
    }
  }

  const lastKey = keys[keys.length - 1]
  if (lastKey === undefined) {
    return
  }

  current[lastKey] = value
}

const asNumber = (value: unknown, label: string): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Expected number for ${label}, received ${String(value)}`)
  }

  return value
}

const asHexColor = (value: unknown, label: string): HexColorToken => {
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

const isContextBasedProperty = (
  value: unknown
): value is ContextBasedProperty<string, Record<string, string>, unknown> => (
  isRecord(value)
  && 'base' in value
  && !('type' in value)
  && !('path' in value)
  && !('operation' in value)
)

const resolveContextBasedProperty = <S extends string, V>(
  property: ContextBasedProperty<S, Record<string, string>, V>,
  activeStates: ReadonlySet<S>,
  config?: Record<string, string>
): V => {
  let result = property.base

  for (const override of property.overrides ?? []) {
    if (
      matchesStateConditions(activeStates, override.condition)
      && matchesNegativeStateConditions(activeStates, override.negativeCondition)
      && matchesConfigCondition(config, override.configCondition)
    ) {
      result = override.value
    }
  }

  return result
}

const ensureParams = (context: TokenResolveContext): Record<string, unknown> => {
  if (!isRecord(context.params)) {
    context.params = {}
  }

  return context.params as Record<string, unknown>
}

export function resolveResolvableValue (
  value: unknown,
  context: TokenResolveContext
): unknown {
  const resolveSemanticVariable = (nestedPath: string): unknown => {
    const cached = tryGetAtPath(context.params, nestedPath)
    if (cached !== undefined) {
      return cached
    }

    const node = tryGetAtPath(context.semantics, nestedPath)
    if (node === undefined) {
      throw new Error(`Token path not found: semantics.${nestedPath}`)
    }

    if (isContextBasedProperty(node)) {
      const state = context.state ?? new Set<string>()
      const resolved = resolveResolvableValue(
        resolveContextBasedProperty(node, state, context.config),
        context
      )
      setAtPath(ensureParams(context), nestedPath, resolved)
      return resolved
    }

    return node
  }

  const resolveVariablePath = (path: string): unknown => {
    const semanticsPrefix = 'semantics.'
    if (path.startsWith(semanticsPrefix)) {
      return resolveSemanticVariable(path.slice(semanticsPrefix.length))
    }

    return getAtPath(context, path)
  }

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

    return resolveVariablePath(value.path)
  }

  if (type === 'parameter') {
    if (typeof value.path !== 'string') {
      throw new Error('Parameter resolvable is missing a string path')
    }

    const found = tryGetAtPath(context, value.path)
    if (found !== undefined) {
      return found
    }

    return resolveResolvableValue(value.fallback, context)
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

export const resolveConfigNode = <T = unknown>(
  value: unknown,
  context: TokenResolveContext
): T => {
  const state = context.state ?? new Set<string>()

  if (isContextBasedProperty(value)) {
    return resolveResolvableValue(
      resolveContextBasedProperty(value, state, context.config),
      context
    ) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveConfigNode(item, context)) as T
  }

  if (!isRecord(value)) {
    return resolveResolvableValue(value, context) as T
  }

  if (
    value.type === 'variable'
    || value.type === 'parameter'
    || value.type === 'calculation'
    || value.type === 'color'
    || (value.type === undefined && 'value' in value)
  ) {
    return resolveResolvableValue(value, context) as T
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = resolveConfigNode(value[key], context)
  }

  return result as T
}

export const resolveContainerTokenConfig = (
  tokens: ComponentTokenConfig<ContainerTokens, TokenContext<any>>,
  context: TokenResolveContext
): ContainerTokens => resolveConfigNode<ContainerTokens>(tokens, context)

export const resolveIconTokenConfig = (
  tokens: ComponentTokenConfig<IconTokens, TokenContext<any>>,
  context: TokenResolveContext
): IconTokens => resolveConfigNode<IconTokens>(tokens, context)

export const resolveTextStyleTokenConfig = (
  tokens: ComponentTokenConfig<TextStyleTokens, TokenContext<any>>,
  context: TokenResolveContext
): TextStyleTokens => resolveConfigNode<TextStyleTokens>(tokens, context)
