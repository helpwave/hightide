import { MathUtil } from '../../src/utils/math'

describe('MathUtil', () => {
  describe('clamp', () => {
    test('clamps value between min and max', () => {
      expect(MathUtil.clamp(5, 0, 10)).toBe(5)
      expect(MathUtil.clamp(-1, 0, 10)).toBe(0)
      expect(MathUtil.clamp(15, 0, 10)).toBe(10)
    })

    test('clamps with only minimum', () => {
      expect(MathUtil.clamp(-5, 0, undefined)).toBe(0)
      expect(MathUtil.clamp(5, 0, undefined)).toBe(5)
    })

    test('clamps with only maximum', () => {
      expect(MathUtil.clamp(15, undefined, 10)).toBe(10)
      expect(MathUtil.clamp(5, undefined, 10)).toBe(5)
    })

    test('returns value unchanged when min and max are undefined', () => {
      expect(MathUtil.clamp(42, undefined, undefined)).toBe(42)
    })
  })

  describe('clamp01', () => {
    test('clamps value between 0 and 1', () => {
      expect(MathUtil.clamp01(0.5)).toBe(0.5)
      expect(MathUtil.clamp01(-0.2)).toBe(0)
      expect(MathUtil.clamp01(1.5)).toBe(1)
    })
  })

  describe('closestStep', () => {
    test('returns value unchanged when already aligned to modulo', () => {
      expect(MathUtil.closestStep(10, 5)).toBe(10)
      expect(MathUtil.closestStep(0, 5)).toBe(0)
    })

    test('rounds to nearest step', () => {
      expect(MathUtil.closestStep(7, 5)).toBe(5)
      expect(MathUtil.closestStep(8, 5)).toBe(10)
      expect(MathUtil.closestStep(2, 5)).toBe(0)
    })

    test('supports fractional step sizes', () => {
      expect(MathUtil.closestStep(1.3, 0.5)).toBe(1.5)
      expect(MathUtil.closestStep(1.1, 0.5)).toBe(1)
    })

    test('rounds negative values to nearest multiple', () => {
      expect(MathUtil.closestStep(-7, 5)).toBe(-5)
      expect(MathUtil.closestStep(-8, 5)).toBe(-10)
    })
  })

  describe('resolveLoopingRangeValue', () => {
    test('returns value unchanged when within range', () => {
      expect(MathUtil.resolveLoopingRangeValue(5, 0, 10)).toEqual({
        value: 5,
        loopedOver: null,
      })
    })

    test('returns boundary values unchanged', () => {
      expect(MathUtil.resolveLoopingRangeValue(0, 0, 10)).toEqual({
        value: 0,
        loopedOver: null,
      })
      expect(MathUtil.resolveLoopingRangeValue(10, 0, 10)).toEqual({
        value: 10,
        loopedOver: null,
      })
    })

    test('wraps values above maximum', () => {
      expect(MathUtil.resolveLoopingRangeValue(11, 0, 10)).toEqual({
        value: 1,
        loopedOver: 'maximum',
      })
      expect(MathUtil.resolveLoopingRangeValue(24, 0, 23)).toEqual({
        value: 1,
        loopedOver: 'maximum',
      })
    })

    test('wraps values below minimum', () => {
      expect(MathUtil.resolveLoopingRangeValue(0, 1, 12)).toEqual({
        value: 0,
        loopedOver: 'minimum',
      })
      expect(MathUtil.resolveLoopingRangeValue(-2, 0, 23)).toEqual({
        value: -2,
        loopedOver: 'minimum',
      })
    })

    test('supports non-zero minimum', () => {
      expect(MathUtil.resolveLoopingRangeValue(13, 1, 12)).toEqual({
        value: 2,
        loopedOver: 'maximum',
      })
    })
  })
})
