import { MathUtil } from '@/src/utils/math'

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

  describe('roundModulo', () => {
    test('returns value unchanged when already aligned to modulo', () => {
      expect(MathUtil.roundModulo(10, 5)).toBe(10)
      expect(MathUtil.roundModulo(0, 5)).toBe(0)
    })

    test('rounds to nearest multiple of modulo', () => {
      expect(MathUtil.roundModulo(7, 5)).toBe(5)
      expect(MathUtil.roundModulo(8, 5)).toBe(10)
      expect(MathUtil.roundModulo(2, 5)).toBe(0)
    })

    test('supports fractional modulo', () => {
      expect(MathUtil.roundModulo(1.3, 0.5)).toBe(1.5)
      expect(MathUtil.roundModulo(1.1, 0.5)).toBe(1)
    })

    test('rounds negative values to nearest multiple', () => {
      expect(MathUtil.roundModulo(-7, 5)).toBe(-5)
      expect(MathUtil.roundModulo(-8, 5)).toBe(-10)
    })
  })
})
