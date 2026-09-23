import type { HexColor } from '../utils/hex-color'
import { isColorToken } from '../primitive-tokens/color-token'
import { isNumberToken } from '../primitive-tokens/number-token'
import type {
  NumberBinaryCalculationOperation,
  NumberCalculationOperation,
  NumberUnaryCalculationOperation
} from '../primitive-tokens/number-calc'
import type { ResolverConfig, HightideResolverParams, ResolverParams, ResolverState } from '../primitive-tokens/resolver-types'
import type { SemanticTokens } from '../semantic-tokens/semantic-tokens'
import type { ThemeTokens } from '../theme-tokens/create'
import { HexColorUtils } from '../utils/hex'
import { OKLCHUtils } from '../utils/oklch'
import { TokenBuilder } from '../utils'
import type { ContextBasedProperty } from '../component-tokens/context-based'
import { matchesConfigCondition } from '../component-tokens/context-based'
import type { ContainerStyle } from './container-style'
import type { IconStyle } from './icon-style'
import type { Resolved } from './resolved'
import type { TextStyle } from './text-style'

const matchesStateConditions = (
  active: ReadonlySet<string>,
  condition?: ReadonlySet<string>
): boolean => {
  if (condition === undefined || condition.size === 0) {
    return true
  }

  for (const state of condition) {
    if (!active.has(state)) {
      return false
    }
  }

  return true
}

const matchesNegativeStateConditions = (
  active: ReadonlySet<string>,
  negativeCondition?: ReadonlySet<string>
): boolean => {
  if (negativeCondition === undefined || negativeCondition.size === 0) {
    return true
  }

  for (const state of negativeCondition) {
    if (active.has(state)) {
      return false
    }
  }

  return true
}

export type TokenResolveContext = {
  theme: object,
  semantics?: object,
  params?: ResolverParams,
  config?: ResolverConfig,
  state?: ReadonlySet<ResolverState>,
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
  if (isNumberToken(value)) {
    return value.value
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }
  throw new Error(`Expected number for ${label}, received ${String(value)}`)
}

const asHexColor = (value: unknown, label: string): HexColor => {
  if (isColorToken(value)) {
    return value.value
  }
  if (typeof value === 'string' && value.startsWith('#')) {
    return value as HexColor
  }
  throw new Error(`Expected color for ${label}, received ${String(value)}`)
}

const resolveBinaryCalculation = (
  operation: NumberBinaryCalculationOperation,
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
  }
}

const resolveUnaryCalculation = (
  operation: NumberUnaryCalculationOperation,
  value: number
): number => {
  switch (operation) {
  case 'floor':
    return Math.floor(value)
  case 'round':
    return Math.round(value)
  case 'ceil':
    return Math.ceil(value)
  }
}

const isUnaryCalculationOperation = (
  operation: NumberCalculationOperation
): operation is NumberUnaryCalculationOperation => (
  operation === 'floor' || operation === 'round' || operation === 'ceil'
)

const isContextBasedProperty = (
  value: unknown
): value is ContextBasedProperty<unknown, string, Record<string, string>> => (
  isRecord(value)
  && 'base' in value
  && !('type' in value)
  && !('ref' in value)
  && !('kind' in value)
  && !('path' in value)
  && !('operation' in value)
)

const resolveContextBasedProperty = <S extends string, V>(
  property: ContextBasedProperty<V, S, Record<string, string>>,
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

  return result as V
}

const ensureParams = (context: TokenResolveContext): Record<string, unknown> => {
  if (!isRecord(context.params)) {
    context.params = { colors: {}, numbers: {} }
  }

  return context.params as Record<string, unknown>
}

const primitiveLeafTypeSet = new Set<string>([
  'axisAlignment',
  'borderStyle',
  'color',
  'colorOp',
  'colorValue',
  'crossAxisAlignment',
  'crossAxisLineAlignment',
  'flexWrap',
  'fontFamily',
  'fontWeight',
  'layoutDirection',
  'mainAxisAlignment',
  'number',
  'numberCalc',
  'numberValue',
  'outlineStyle',
  'overflow',
  'percent',
  'spacingAlignment',
  'stretch',
  'textAlign',
])

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
        resolveContextBasedProperty(node, state, context.config as Record<string, string> | undefined),
        context
      )
      setAtPath(ensureParams(context), nestedPath, resolved)
      return resolved
    }

    return resolveResolvableValue(node, context)
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

  if (typeof type === 'string' && (type.startsWith('ref.') || type.endsWith('Ref'))) {
    const refPath = typeof value.path === 'string' ? value.path : value.ref
    if (typeof refPath !== 'string') {
      throw new Error('Ref resolvable is missing a string path')
    }
    const found = tryGetAtPath(context, refPath)
    if (found !== undefined) {
      return resolveResolvableValue(found, context)
    }
    if ('fallback' in value) {
      return resolveResolvableValue(value.fallback, context)
    }
    throw new Error(`Token path not found: ${refPath}`)
  }

  if (type === 'variable' || type === 'parameter') {
    if (typeof value.path !== 'string') {
      throw new Error('Ref resolvable is missing a string path')
    }
    const found = tryGetAtPath(context, value.path)
    if (found !== undefined) {
      return resolveResolvableValue(found, context)
    }
    if (type === 'parameter' && 'fallback' in value) {
      return resolveResolvableValue(value.fallback, context)
    }
    return resolveVariablePath(value.path)
  }

  if (type === 'numberValue') {
    return resolveResolvableValue(value.value, context)
  }

  if (type === 'colorValue') {
    return resolveResolvableValue(value.value, context)
  }

  if (type === 'numberCalc' || type === 'calculation') {
    const payload = isRecord(value.value) ? value.value : value
    const operation = payload.operation as NumberCalculationOperation

    if (isUnaryCalculationOperation(operation)) {
      const operand = payload.value ?? payload.value1
      const resolved = asNumber(resolveResolvableValue(operand, context), 'calculation.value')
      return TokenBuilder.number(resolveUnaryCalculation(operation, resolved))
    }

    const value1 = asNumber(resolveResolvableValue(payload.value1, context), 'calculation.value1')
    const value2 = asNumber(resolveResolvableValue(payload.value2, context), 'calculation.value2')
    return TokenBuilder.number(resolveBinaryCalculation(operation, value1, value2))
  }

  if (type === 'colorOp' || (type === 'color' && 'operation' in value)) {
    const payload = isRecord(value.value) ? value.value : value
    const operation = payload.operation

    if (operation === 'opacity') {
      const color = asHexColor(resolveResolvableValue(payload.color, context), 'color.opacity')
      const amount = asNumber(resolveResolvableValue(payload.amount, context), 'color.opacity.amount')
      return TokenBuilder.color(HexColorUtils.hexWithAlpha(color, amount))
    }

    if (operation === 'lightness') {
      const color = asHexColor(resolveResolvableValue(payload.color, context), 'color.lightness')
      const amount = asNumber(resolveResolvableValue(payload.amount, context), 'color.lightness.amount')
      return TokenBuilder.color(OKLCHUtils.changeLightness(color, amount))
    }

    if (operation === 'blend') {
      const background = asHexColor(
        resolveResolvableValue(payload.background, context),
        'color.blend.background'
      )
      const tint = asHexColor(resolveResolvableValue(payload.tint, context), 'color.blend.tint')
      return TokenBuilder.color(HexColorUtils.blend(background, tint))
    }

    throw new Error(`Unknown color operation: ${String(operation)}`)
  }

  if (typeof type === 'string' && primitiveLeafTypeSet.has(type) && 'value' in value) {
    return value
  }

  if (type === undefined && 'value' in value && Object.keys(value).length <= 2) {
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
      resolveContextBasedProperty(value, state, context.config as Record<string, string> | undefined),
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
    (typeof value.type === 'string' && (value.type.endsWith('Ref') || value.type.startsWith('ref.')))
    || value.type === 'variable'
    || value.type === 'parameter'
    || value.type === 'numberCalc'
    || value.type === 'numberValue'
    || value.type === 'colorValue'
    || value.type === 'calculation'
    || value.type === 'colorOp'
    || (typeof value.type === 'string' && primitiveLeafTypeSet.has(value.type) && 'value' in value)
    || (value.type === undefined && 'value' in value && Object.keys(value).length <= 2)
  ) {
    return resolveResolvableValue(value, context) as T
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    if (key === 'kind' || key === 'type') {
      result[key] = value[key]
      continue
    }
    result[key] = resolveConfigNode(value[key], context)
  }

  return result as T
}

const unwrapPrimitiveLeaves = (value: unknown): unknown => {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(unwrapPrimitiveLeaves)
  }

  if (!isRecord(value)) {
    return value
  }

  const type = value.type
  if (typeof type === 'string' && primitiveLeafTypeSet.has(type) && 'value' in value) {
    return value.value
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = unwrapPrimitiveLeaves(value[key])
  }

  return result
}

type ResolveComponentTokenArgs<Theme extends ThemeTokens, T> = {
  component: T,
  semantics: SemanticTokens<string, ResolverConfig>,
  theme: Theme,
  state: ReadonlySet<string>,
  config: ResolverConfig,
  params: HightideResolverParams & Record<string, unknown>,
}

export function resolveComponentToken<
  Theme extends ThemeTokens,
  T extends { type?: string, kind?: string }
>(
  args: ResolveComponentTokenArgs<Theme, T>
): T extends { type: 'icon' } | { kind: 'icon' } ? IconStyle
  : T extends { type: 'textStyle' } | { kind: 'textStyle' } ? TextStyle
  : ContainerStyle {
  const context: TokenResolveContext = {
    theme: args.theme,
    semantics: args.semantics,
    params: args.params,
    config: args.config,
    state: args.state,
  }

  return unwrapPrimitiveLeaves(resolveConfigNode(args.component, context)) as T extends { type: 'icon' } | { kind: 'icon' } ? IconStyle
    : T extends { type: 'textStyle' } | { kind: 'textStyle' } ? TextStyle
    : ContainerStyle
}

export const resolveContainerTokens = (
  tokens: unknown,
  context: TokenResolveContext
): ContainerStyle => unwrapPrimitiveLeaves(resolveConfigNode(tokens, context)) as ContainerStyle

export const resolveIconTokens = (
  tokens: unknown,
  context: TokenResolveContext
): IconStyle => unwrapPrimitiveLeaves(resolveConfigNode(tokens, context)) as IconStyle

export const resolveTextTokens = (
  tokens: unknown,
  context: TokenResolveContext
): TextStyle => unwrapPrimitiveLeaves(resolveConfigNode(tokens, context)) as TextStyle

export const resolveTokens = <T>(
  tokens: unknown,
  context: TokenResolveContext
): Resolved<T> => unwrapPrimitiveLeaves(resolveConfigNode(tokens, context)) as Resolved<T>

export const resolveContainerTokenConfig = resolveContainerTokens
export const resolveIconTokenConfig = resolveIconTokens
export const resolveTextStyleTokenConfig = resolveTextTokens
