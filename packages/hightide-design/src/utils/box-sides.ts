export type WritingOrientation = 'horizontal' | 'vertical'
export type AxisFlow = 'forward' | 'reverse'

export type WritingConfig = {
  'writing-orientation': WritingOrientation,
  'inline': AxisFlow,
  'block': AxisFlow,
}

export const defaultWritingConfig = {
  'writing-orientation': 'horizontal',
  'inline': 'forward',
  'block': 'forward',
} as const satisfies WritingConfig

export const writingConfigDefaults: Record<string, string> = {
  'writing-orientation': defaultWritingConfig['writing-orientation'],
  'inline': defaultWritingConfig.inline,
  'block': defaultWritingConfig.block,
}

export type PhysicalSide = 'left' | 'right' | 'top' | 'bottom'
export type PhysicalCorner = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'

export type PhysicalBoxSides<T> = {
  top?: T,
  right?: T,
  bottom?: T,
  left?: T,
}

export type BoxSidesInput<T> =
  | {
      value: T,
    }
  | {
      horizontal?: T,
      vertical?: T,
    }
  | {
      top?: T,
      left?: T,
      right?: T,
      bottom?: T,
    }
  | {
      inline?: T,
      block?: T,
    }
  | {
      inlineStart?: T,
      inlineEnd?: T,
      blockStart?: T,
      blockEnd?: T,
    }

export type PhysicalBoxCorners<T> = {
  topLeft?: T,
  topRight?: T,
  bottomRight?: T,
  bottomLeft?: T,
}

export type BoxCornersInput<T> =
  | {
      value: T,
    }
  | {
      topLeft?: T,
      topRight?: T,
      bottomRight?: T,
      bottomLeft?: T,
    }
  | {
      startStart?: T,
      startEnd?: T,
      endStart?: T,
      endEnd?: T,
    }

type AxisEnds = {
  start: PhysicalSide,
  end: PhysicalSide,
}

const writingOrientations = ['horizontal', 'vertical'] as const satisfies readonly WritingOrientation[]
const axisFlows = ['forward', 'reverse'] as const satisfies readonly AxisFlow[]

export const writingConfigCombinations: readonly WritingConfig[] = writingOrientations.flatMap((orientation) => (
  axisFlows.flatMap((inline) => (
    axisFlows.map((block) => ({
      'writing-orientation': orientation,
      inline,
      block,
    }))
  ))
))

const horizontalAxis = (flow: AxisFlow): AxisEnds => (
  flow === 'forward'
    ? { start: 'left', end: 'right' }
    : { start: 'right', end: 'left' }
)

const verticalAxis = (flow: AxisFlow): AxisEnds => (
  flow === 'forward'
    ? { start: 'top', end: 'bottom' }
    : { start: 'bottom', end: 'top' }
)

const logicalAxes = (
  orientation: WritingOrientation,
  inline: AxisFlow,
  block: AxisFlow
): { inline: AxisEnds, block: AxisEnds } => (
  orientation === 'horizontal'
    ? {
      inline: horizontalAxis(inline),
      block: verticalAxis(block),
    }
    : {
      inline: verticalAxis(inline),
      block: horizontalAxis(block),
    }
)

const intersectCorner = (first: PhysicalSide, second: PhysicalSide): PhysicalCorner => {
  const sides = new Set([first, second])

  if (sides.has('top') && sides.has('left')) {
    return 'topLeft'
  }

  if (sides.has('top') && sides.has('right')) {
    return 'topRight'
  }

  if (sides.has('bottom') && sides.has('right')) {
    return 'bottomRight'
  }

  return 'bottomLeft'
}

export const boxSidesUseLogical = <T>(input: BoxSidesInput<T>): boolean => (
  'inline' in input
  || 'block' in input
  || 'inlineStart' in input
  || 'inlineEnd' in input
  || 'blockStart' in input
  || 'blockEnd' in input
)

export const boxCornersUseLogical = <T>(input: BoxCornersInput<T>): boolean => (
  'startStart' in input
  || 'startEnd' in input
  || 'endStart' in input
  || 'endEnd' in input
)

export const resolveBoxSides = <T>(
  input: BoxSidesInput<T>,
  orientation: WritingOrientation = defaultWritingConfig['writing-orientation'],
  inline: AxisFlow = defaultWritingConfig.inline,
  block: AxisFlow = defaultWritingConfig.block
): PhysicalBoxSides<T> => {
  const axes = logicalAxes(orientation, inline, block)
  const result: PhysicalBoxSides<T> = {}

  if ('value' in input) {
    return {
      top: input.value,
      right: input.value,
      bottom: input.value,
      left: input.value,
    }
  }

  if ('inlineStart' in input || 'inlineEnd' in input || 'blockStart' in input || 'blockEnd' in input) {
    if (input.inlineStart !== undefined) {
      result[axes.inline.start] = input.inlineStart
    }

    if (input.inlineEnd !== undefined) {
      result[axes.inline.end] = input.inlineEnd
    }

    if (input.blockStart !== undefined) {
      result[axes.block.start] = input.blockStart
    }

    if (input.blockEnd !== undefined) {
      result[axes.block.end] = input.blockEnd
    }

    return result
  }

  if ('inline' in input || 'block' in input) {
    if (input.inline !== undefined) {
      result[axes.inline.start] = input.inline
      result[axes.inline.end] = input.inline
    }

    if (input.block !== undefined) {
      result[axes.block.start] = input.block
      result[axes.block.end] = input.block
    }

    return result
  }

  if ('horizontal' in input || 'vertical' in input) {
    if (input.horizontal !== undefined) {
      result.left = input.horizontal
      result.right = input.horizontal
    }

    if (input.vertical !== undefined) {
      result.top = input.vertical
      result.bottom = input.vertical
    }

    return result
  }

  if('top' in input || 'right' in input || 'bottom' in input || 'left' in input) {
    if (input.top !== undefined) {
      result.top = input.top
    }

    if (input.right !== undefined) {
      result.right = input.right
    }

    if (input.bottom !== undefined) {
      result.bottom = input.bottom
    }

    if (input.left !== undefined) {
      result.left = input.left
    }

    return result
  }

  return result
}

export const resolveBoxCorners = <T>(
  input: BoxCornersInput<T>,
  orientation: WritingOrientation = defaultWritingConfig['writing-orientation'],
  inline: AxisFlow = defaultWritingConfig.inline,
  block: AxisFlow = defaultWritingConfig.block
): PhysicalBoxCorners<T> => {
  const axes = logicalAxes(orientation, inline, block)
  const result: PhysicalBoxCorners<T> = {}

  if ('value' in input) {
    return {
      topLeft: input.value,
      topRight: input.value,
      bottomRight: input.value,
      bottomLeft: input.value,
    }
  }

  if ('startStart' in input || 'startEnd' in input || 'endStart' in input || 'endEnd' in input) {
    if (input.startStart !== undefined) {
      result[intersectCorner(axes.inline.start, axes.block.start)] = input.startStart
    }

    if (input.startEnd !== undefined) {
      result[intersectCorner(axes.inline.end, axes.block.start)] = input.startEnd
    }

    if (input.endStart !== undefined) {
      result[intersectCorner(axes.inline.start, axes.block.end)] = input.endStart
    }

    if (input.endEnd !== undefined) {
      result[intersectCorner(axes.inline.end, axes.block.end)] = input.endEnd
    }

    return result
  }

  if ('topLeft' in input || 'topRight' in input || 'bottomRight' in input || 'bottomLeft' in input) {
    if (input.topLeft !== undefined) {
      result.topLeft = input.topLeft
    }

    if (input.topRight !== undefined) {
      result.topRight = input.topRight
    }

    if (input.bottomRight !== undefined) {
      result.bottomRight = input.bottomRight
    }

    if (input.bottomLeft !== undefined) {
      result.bottomLeft = input.bottomLeft
    }

    return result
  }

  return result
}

export const isDefaultWritingConfig = (config: WritingConfig): boolean => (
  config['writing-orientation'] === defaultWritingConfig['writing-orientation']
  && config.inline === defaultWritingConfig.inline
  && config.block === defaultWritingConfig.block
)
