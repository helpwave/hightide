const equalSizeGroups = <T>(array: T[], groupSize: number): T[][] => {
  if (groupSize <= 0) {
    console.warn(`group size should be greater than 0: groupSize = ${groupSize}`)
    return [[...array]]
  }

  const groups = []
  for (let i = 0; i < array.length; i += groupSize) {
    groups.push(array.slice(i, Math.min(i + groupSize, array.length)))
  }
  return groups
}

export type RangeOptions = {
  allowEmptyRange: boolean,
  stepSize: number,
  exclusiveStart: boolean,
  exclusiveEnd: boolean,
}

const defaultRangeOptions: RangeOptions = {
  allowEmptyRange: false,
  stepSize: 1,
  exclusiveStart: false,
  exclusiveEnd: true,
}

const range = (endOrRange: number | [number, number], options?: Partial<RangeOptions>): number[] => {
  const { allowEmptyRange, stepSize, exclusiveStart, exclusiveEnd } = { ...defaultRangeOptions, ...options }
  let start = 0
  let end: number
  if (typeof endOrRange === 'number') {
    end = endOrRange
  } else {
    start = endOrRange[0]
    end = endOrRange[1]
  }
  if (!exclusiveEnd) {
    end -= 1
  }
  if (exclusiveStart) {
    start += 1
  }

  if (end - 1 < start) {
    if (!allowEmptyRange) {
      console.warn(`range: end (${end}) < start (${start}) should be allowed explicitly, set options.allowEmptyRange to true`)
    }
    return []
  }
  return Array.from({ length: end - start }, (_, index) => index * stepSize + start)
}

const closestMatch = <T>(list: T[], firstCloser: (item1: T, item2: T) => boolean) => {
  return list.reduce((item1, item2) => {
    return firstCloser(item1, item2) ? item1 : item2
  })
}

const getNeighbours = <T>(list: T[], item: T, neighbourDistance: number = 2) => {
  const index = list.indexOf(item)
  const totalItems = neighbourDistance * 2 + 1
  if (list.length < totalItems) {
    console.warn('List is to short')
    return list
  }

  if (index === -1) {
    console.error('item not found in list')
    return list.splice(0, totalItems)
  }

  let start = index - neighbourDistance
  if (start < 0) {
    start += list.length
  }
  const end = (index + neighbourDistance + 1) % list.length

  const result: T[] = []
  let ignoreOnce = list.length === totalItems
  for (let i = start; i !== end || ignoreOnce; i = (i + 1) % list.length) {
    result.push(list[i]!)
    if (end === i && ignoreOnce) {
      ignoreOnce = false
    }
  }
  return result
}

const createLoopingListWithIndex = <T>(list: T[], startIndex: number = 0, length: number = 0, forwards: boolean = true) => {
  if (length < 0) {
    console.warn(`createLoopingList: length must be >= 0, given ${length}`)
  } else if (length === 0) {
    length = list.length
  }

  const returnList: [number, T][] = []

  if (forwards) {
    for (let i = startIndex; returnList.length < length; i = (i + 1) % list.length) {
      returnList.push([i, list[i]!])
    }
  } else {
    for (let i = startIndex; returnList.length < length; i = i === 0 ? i = list.length - 1 : i - 1) {
      returnList.push([i, list[i]!])
    }
  }

  return returnList
}

const createLoopingList = <T>(list: T[], startIndex: number = 0, length: number = 0, forwards: boolean = true) => {
  return createLoopingListWithIndex(list, startIndex, length, forwards).map(([_, item]) => item)
}

const moveItems = <T>(list: T[], move: number = 0) => {
  const result = []
  let start = move
  if (start < 0) {
    start = list.length - move
  }
  start = start % list.length
  for (let i = 0; i < list.length; i++) {
    result[i] = list[(i + start) % list.length]
  }
  return result
}

function resolveSingleOrArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value
  } else if (value) {
    return [value]
  }
  return []
}

export const ArrayUtil = {
  equalSizeGroups,
  range,
  closestMatch,
  getNeighbours,
  createLoopingListWithIndex,
  createLoopingList,
  unique: <T>(list: T[]): T[] => {
    const seen = new Set<T>()
    return list.filter((item) => {
      if (seen.has(item)) {
        return false
      }
      seen.add(item)
      return true
    })
  },
  difference: <T>(list: T[], removeList: T[]): T[] => {
    const remove = new Set<T>(removeList)
    return list.filter((item) => !remove.has(item))
  },
  moveItems,
  resolveSingleOrArray,
}

/** @deprecated Use ArrayUtil.equalSizeGroups instead. */
export { equalSizeGroups }

/** @deprecated Use ArrayUtil.range instead. */
export { range }

/** @deprecated Use ArrayUtil.closestMatch instead. */
export { closestMatch }

/** @deprecated Use ArrayUtil.getNeighbours instead. */
export { getNeighbours }

/** @deprecated Use ArrayUtil.createLoopingListWithIndex instead. */
export { createLoopingListWithIndex }

/** @deprecated Use ArrayUtil.createLoopingList instead. */
export { createLoopingList }
