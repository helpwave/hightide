import {
  resolveContainerTokens,
  resolveIconTokens,
  resolveTextTokens,
} from '@helpwave/hightide-design/resolver'
import { StyleAdapterUtils } from './adapters'
import type { TokenContext, TokenContextInput } from './token-context'

const styleTypes = new Set(['container', 'icon', 'textStyle'])

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

const isStyleNode = (value: unknown): value is { type: 'container' | 'icon' | 'textStyle' } => (
  isRecord(value)
  && typeof value.type === 'string'
  && styleTypes.has(value.type)
)

export type StyleLeaf<TStyle> = (context?: TokenContextInput) => TStyle

const toLeaf = (
  node: { type: 'container' | 'icon' | 'textStyle' },
  bind: (input?: TokenContextInput) => TokenContext
): StyleLeaf<unknown> => {
  if (node.type === 'container') {
    return (input) => StyleAdapterUtils.container(resolveContainerTokens(node, bind(input)))
  }

  if (node.type === 'icon') {
    return (input) => StyleAdapterUtils.icon(resolveIconTokens(node, bind(input)))
  }

  return (input) => StyleAdapterUtils.text(resolveTextTokens(node, bind(input)))
}

export const createLeaves = (
  tokens: unknown,
  bind: (input?: TokenContextInput) => TokenContext
): unknown => {
  if (isStyleNode(tokens)) {
    return toLeaf(tokens, bind)
  }

  if (!isRecord(tokens)) {
    return undefined
  }

  if (typeof tokens.type === 'string') {
    return undefined
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(tokens)) {
    if (
      key === 'overrides'
      || key === 'config'
      || key.endsWith('Override')
      || key.endsWith('Overrides')
      || key.endsWith('Overwrites')
    ) {
      continue
    }

    const mapped = createLeaves(value, bind)
    if (mapped !== undefined) {
      result[key] = mapped
    }
  }

  return result
}

export const namedContainerLeaf = (
  tokens: unknown,
  bind: (input?: TokenContextInput) => TokenContext
): { container: StyleLeaf<unknown> } | unknown => {
  if (isStyleNode(tokens) && tokens.type === 'container') {
    return {
      container: toLeaf(tokens, bind),
    }
  }

  return createLeaves(tokens, bind)
}
