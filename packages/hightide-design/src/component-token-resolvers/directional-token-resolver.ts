import type {
  DirectionalToken,
  PhysicalSideToken
} from './container-tokens'

export type WritingModeKind = 'horizontal-tb' | 'vertical-rl' | 'vertical-lr'
export type TextDirectionToken = 'ltr' | 'rtl'

export type WritingModeToken = {
  writingMode: WritingModeKind,
  direction: TextDirectionToken,
}

export const defaultWritingMode: WritingModeToken = {
  writingMode: 'horizontal-tb',
  direction: 'ltr',
}

type LogicalToPhysicalSides = {
  blockStart: keyof Omit<PhysicalSideToken<unknown>, 'type'>,
  blockEnd: keyof Omit<PhysicalSideToken<unknown>, 'type'>,
  inlineStart: keyof Omit<PhysicalSideToken<unknown>, 'type'>,
  inlineEnd: keyof Omit<PhysicalSideToken<unknown>, 'type'>,
}

const resolveLogicalSideMap = (
  writingMode: WritingModeToken
): LogicalToPhysicalSides => {
  const { writingMode: mode, direction } = writingMode
  const inlineStartIsStart = direction === 'ltr'

  if (mode === 'horizontal-tb') {
    return {
      blockStart: 'top',
      blockEnd: 'bottom',
      inlineStart: inlineStartIsStart ? 'left' : 'right',
      inlineEnd: inlineStartIsStart ? 'right' : 'left',
    }
  }

  if (mode === 'vertical-rl') {
    return {
      blockStart: 'right',
      blockEnd: 'left',
      inlineStart: inlineStartIsStart ? 'top' : 'bottom',
      inlineEnd: inlineStartIsStart ? 'bottom' : 'top',
    }
  }

  return {
    blockStart: 'left',
    blockEnd: 'right',
    inlineStart: inlineStartIsStart ? 'top' : 'bottom',
    inlineEnd: inlineStartIsStart ? 'bottom' : 'top',
  }
}

const assignSide = <T>(
  result: PhysicalSideToken<T>,
  side: keyof Omit<PhysicalSideToken<T>, 'type'>,
  value: T | undefined
) => {
  if (value !== undefined) {
    result[side] = value
  }
}

const assignAxis = <T>(
  result: PhysicalSideToken<T>,
  start: keyof Omit<PhysicalSideToken<T>, 'type'>,
  end: keyof Omit<PhysicalSideToken<T>, 'type'>,
  value: T | undefined
) => {
  assignSide(result, start, value)
  assignSide(result, end, value)
}

const toPhysicalSideToken = <T>(
  token: DirectionalToken<T>,
  writingMode: WritingModeToken
): PhysicalSideToken<T> => {
  const result: PhysicalSideToken<T> = { type: 'physicalSide' }
  const logical = resolveLogicalSideMap(writingMode)

  switch (token.type) {
  case 'all':
    assignSide(result, 'top', token.value)
    assignSide(result, 'right', token.value)
    assignSide(result, 'bottom', token.value)
    assignSide(result, 'left', token.value)
    break
  case 'physicalAxis':
    assignAxis(result, 'left', 'right', token.horizontal)
    assignAxis(result, 'top', 'bottom', token.vertical)
    break
  case 'physicalSide':
    assignSide(result, 'top', token.top)
    assignSide(result, 'right', token.right)
    assignSide(result, 'bottom', token.bottom)
    assignSide(result, 'left', token.left)
    break
  case 'logicalAxis':
    assignAxis(result, logical.inlineStart, logical.inlineEnd, token.inline)
    assignAxis(result, logical.blockStart, logical.blockEnd, token.block)
    break
  case 'logicalSide':
    assignSide(result, logical.inlineStart, token.inlineStart)
    assignSide(result, logical.inlineEnd, token.inlineEnd)
    assignSide(result, logical.blockStart, token.blockStart)
    assignSide(result, logical.blockEnd, token.blockEnd)
    break
  }

  return result
}

export const resolveDirectionalTokens = <T>(
  tokens: ReadonlyArray<DirectionalToken<T>>,
  writingMode: WritingModeToken
): PhysicalSideToken<T> => {
  const result: PhysicalSideToken<T> = { type: 'physicalSide' }

  for (const token of tokens) {
    const resolved = toPhysicalSideToken(token, writingMode)
    assignSide(result, 'top', resolved.top)
    assignSide(result, 'right', resolved.right)
    assignSide(result, 'bottom', resolved.bottom)
    assignSide(result, 'left', resolved.left)
  }

  return result
}
