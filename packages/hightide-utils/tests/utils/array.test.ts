import {
  ArrayUtil,
  closestMatch,
  createLoopingList,
  createLoopingListWithIndex,
  equalSizeGroups,
  getNeighbours,
  range
} from '../../src/utils/array'

describe('array utils', () => {
  describe('equalSizeGroups', () => {
    test('splits array into groups of given size', () => {
      expect(equalSizeGroups([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    test('returns single group when group size is invalid', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
      expect(equalSizeGroups([1, 2, 3], 0)).toEqual([[1, 2, 3]])
      warn.mockRestore()
    })
  })

  describe('range', () => {
    test('creates range from 0 to exclusive end', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4])
    })

    test('creates range from start to exclusive end', () => {
      expect(range([2, 5])).toEqual([2, 3, 4])
    })

    test('supports inclusive end', () => {
      expect(range(3, { exclusiveEnd: false })).toEqual([0, 1])
    })

    test('supports step size', () => {
      expect(range([0, 6], { stepSize: 2 })).toEqual([0, 2, 4, 6, 8, 10])
    })

    test('returns empty array for inverted range when allowed', () => {
      expect(range([5, 2], { allowEmptyRange: true })).toEqual([])
    })
  })

  describe('closestMatch', () => {
    test('returns item that is closest according to comparator', () => {
      const closest = closestMatch([10, 19, 30], (a, b) => Math.abs(a - 15) < Math.abs(b - 15))
      expect(closest).toBe(19)
    })
  })

  describe('getNeighbours', () => {
    test('returns neighbours wrapping around list boundaries', () => {
      expect(getNeighbours([1, 2, 3, 4, 5, 6], 1, 2)).toEqual([5, 6, 1, 2, 3])
    })
  })

  describe('createLoopingListWithIndex', () => {
    test('creates forward looping list with indices', () => {
      expect(createLoopingListWithIndex(['a', 'b', 'c'], 1, 4)).toEqual([
        [1, 'b'],
        [2, 'c'],
        [0, 'a'],
        [1, 'b'],
      ])
    })

    test('creates backward looping list with indices', () => {
      expect(createLoopingListWithIndex(['a', 'b', 'c'], 1, 3, false)).toEqual([
        [1, 'b'],
        [0, 'a'],
        [2, 'c'],
      ])
    })

    test('defaults length to list length', () => {
      expect(createLoopingList(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
    })
  })

  describe('ArrayUtil', () => {
    test('unique removes duplicate entries', () => {
      expect(ArrayUtil.unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3])
    })

    test('difference removes items present in second list', () => {
      expect(ArrayUtil.difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
    })

    test('moveItems rotates list by given offset', () => {
      expect(ArrayUtil.moveItems(['a', 'b', 'c', 'd'], 1)).toEqual(['b', 'c', 'd', 'a'])
      expect(ArrayUtil.moveItems(['a', 'b', 'c', 'd'], 2)).toEqual(['c', 'd', 'a', 'b'])
    })

    test('resolveSingleOrArray normalizes single values and arrays', () => {
      expect(ArrayUtil.resolveSingleOrArray('a')).toEqual(['a'])
      expect(ArrayUtil.resolveSingleOrArray(['a', 'b'])).toEqual(['a', 'b'])
      expect(ArrayUtil.resolveSingleOrArray('')).toEqual([])
    })
  })
})
