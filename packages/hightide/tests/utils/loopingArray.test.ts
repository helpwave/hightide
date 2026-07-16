import { LoopingArrayCalculator } from '@/src/utils/loopingArray'

describe('LoopingArrayCalculator', () => {
  describe('constructor', () => {
    test('throws when length is less than 1', () => {
      expect(() => new LoopingArrayCalculator(0)).toThrow('Invalid parameters')
    })

    test('throws when allowedOverScroll is negative', () => {
      expect(() => new LoopingArrayCalculator(5, true, -1)).toThrow('Invalid parameters')
    })
  })

  describe('getCorrectedPosition', () => {
    const looping = new LoopingArrayCalculator(5)

    test('wraps positions at or above length', () => {
      expect(looping.getCorrectedPosition(5)).toBe(0)
      expect(looping.getCorrectedPosition(6)).toBe(1)
    })

    test('wraps negative positions', () => {
      expect(looping.getCorrectedPosition(-1)).toBe(4)
      expect(looping.getCorrectedPosition(-2)).toBe(3)
    })

    test('returns in-range positions unchanged', () => {
      expect(looping.getCorrectedPosition(2)).toBe(2)
    })

    test('clamps position when not looping', () => {
      const bounded = new LoopingArrayCalculator(5, false, 0.1)

      expect(bounded.getCorrectedPosition(10)).toBe(4.1)
      expect(bounded.getCorrectedPosition(-1)).toBe(-0.1)
    })
  })

  describe('getOffset and withoutOffset', () => {
    test('getOffset returns fractional distance to nearest integer', () => {
      expect(LoopingArrayCalculator.getOffset(45.5)).toBe(0.5)
      expect(LoopingArrayCalculator.getOffset(45.2)).toBeCloseTo(-0.2)
    })

    test('withoutOffset rounds position to nearest integer', () => {
      expect(LoopingArrayCalculator.withoutOffset(45.5)).toBe(46)
      expect(LoopingArrayCalculator.withoutOffset(45.2)).toBe(45)
    })
  })

  describe('getDistanceDirectional', () => {
    const looping = new LoopingArrayCalculator(5)

    test('returns direct forward distance within range', () => {
      expect(looping.getDistanceForward(1, 4)).toBe(3)
    })

    test('returns wrapped forward distance', () => {
      expect(looping.getDistanceForward(4, 1)).toBe(2)
    })

    test('returns backward distance via direction swap', () => {
      expect(looping.getDistanceBackward(4, 1)).toBe(3)
    })

    test('returns shortest distance between two positions', () => {
      expect(looping.getDistance(4, 1)).toBe(2)
      expect(looping.getDistance(1, 4)).toBe(2)
    })

    test('returns Infinity when target is unreachable without looping', () => {
      const bounded = new LoopingArrayCalculator(5, false)

      expect(bounded.getDistanceForward(4, 1)).toBe(Infinity)
      expect(bounded.getDistanceBackward(1, 4)).toBe(Infinity)
    })

    test('throws when position is out of bounds without looping', () => {
      const bounded = new LoopingArrayCalculator(5, false)

      expect(() => bounded.getDistanceForward(10, 1)).toThrow('Invalid parameters')
    })
  })

  describe('getBestDirection', () => {
    const looping = new LoopingArrayCalculator(5)

    test('prefers shorter path regardless of direction', () => {
      expect(looping.getBestDirection(1, 3)).toBe(1)
      expect(looping.getBestDirection(4, 1)).toBe(1)
    })
  })
})
