import {
  applyStepperValue,
  applyStepperValueWithLoopEvent,
  commitNumberInputValue,
  defaultStepperChangeRate,
  detectStepperLoopEvent,
  integrateDefaultStepperChangeRate,
  normalizeStepperInput,
  wrapStepperAnimationValue
} from '@/src/components/user-interaction/input/stepperNumberInputUtils'

describe('stepperNumberInputUtils', () => {
  test('applyStepperValue clamps without looping', () => {
    expect(applyStepperValue(5, 10, 0, 10, false)).toBe(10)
    expect(applyStepperValue(0, -5, 0, 10, false)).toBe(0)
  })

  test('applyStepperValue loops within range', () => {
    expect(applyStepperValue(23, 1, 0, 23, true)).toBe(0)
    expect(applyStepperValue(0, -1, 0, 23, true)).toBe(23)
  })

  test('detectStepperLoopEvent detects boundary crossings', () => {
    expect(detectStepperLoopEvent(23, 24, 0, 23)).toEqual({
      loopedAround: 'maximum',
      changeDirection: 1,
    })
    expect(detectStepperLoopEvent(0, -1, 0, 23)).toEqual({
      loopedAround: 'minimum',
      changeDirection: -1,
    })
    expect(detectStepperLoopEvent(5, 6, 0, 23)).toBeUndefined()
  })

  test('applyStepperValueWithLoopEvent returns loop event when crossing maximum', () => {
    expect(applyStepperValueWithLoopEvent(23, 1, 0, 23, true)).toEqual({
      value: 0,
      loopEvent: {
        loopedAround: 'maximum',
        changeDirection: 1,
      },
    })
  })

  test('normalizeStepperInput rejects non numeric values', () => {
    expect(normalizeStepperInput('abc', 0, 10)).toBeUndefined()
    expect(normalizeStepperInput('5', 0, 10)).toBe(5)
  })

  test('defaultStepperChangeRate starts at five per second and doubles every two seconds', () => {
    expect(defaultStepperChangeRate({
      secondsSinceStart: 0,
      delta: 1,
    })).toBe(5)

    expect(defaultStepperChangeRate({
      secondsSinceStart: 1.9,
      delta: 1,
    })).toBe(5)

    expect(defaultStepperChangeRate({
      secondsSinceStart: 2,
      delta: 1,
    })).toBe(10)

    expect(defaultStepperChangeRate({
      secondsSinceStart: 4,
      delta: -1,
    })).toBe(-20)
  })

  test('defaultStepperChangeRate caps at twenty percent of range', () => {
    expect(defaultStepperChangeRate({
      minimum: 0,
      maximum: 100,
      secondsSinceStart: 10,
      delta: 1,
    })).toBe(20)
  })

  test('integrateDefaultStepperChangeRate matches stepped hold accumulation', () => {
    expect(integrateDefaultStepperChangeRate(0.2)).toBeCloseTo(1, 5)
    expect(integrateDefaultStepperChangeRate(0.4)).toBeCloseTo(2, 5)
    expect(integrateDefaultStepperChangeRate(2.2)).toBeCloseTo(12, 5)
  })

  test('commitNumberInputValue clamps without looping', () => {
    expect(commitNumberInputValue(15, 0, 10, false)).toBe(10)
    expect(commitNumberInputValue(-1, 0, 10, false)).toBe(0)
  })

  test('wrapStepperAnimationValue wraps overflow past maximum for display', () => {
    expect(wrapStepperAnimationValue(1064, 0, 1000)).toBe(64)
    expect(wrapStepperAnimationValue(1001, 0, 1000)).toBe(1)
    expect(wrapStepperAnimationValue(1000, 0, 1000)).toBe(1000)
  })

  test('wrapStepperAnimationValue wraps underflow below minimum for display', () => {
    expect(wrapStepperAnimationValue(-64, 0, 1000)).toBe(937)
    expect(wrapStepperAnimationValue(-1, 0, 1000)).toBe(1000)
  })

  test('commitNumberInputValue uses animation wrap when looping', () => {
    expect(commitNumberInputValue(1064, 0, 1000, true)).toBe(64)
  })
})
