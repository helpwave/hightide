/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useThrottle } from '../../src/hooks/useThrottle'

describe('useThrottle', () => {
  let currentTime = 0

  const advanceTime = (ms: number) => {
    currentTime += ms
    jest.advanceTimersByTime(ms)
  }

  const setPerformanceTime = (time: number) => {
    currentTime = time
  }

  beforeEach(() => {
    currentTime = 0
    jest.useFakeTimers()
    jest.spyOn(performance, 'now').mockImplementation(() => currentTime)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('runs callback immediately when outside cooldown', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useThrottle())

    act(() => {
      result.current(callback)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('runs callback immediately after configured delay elapses', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const { result } = renderHook(() => useThrottle(200))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(200)
    })

    act(() => {
      result.current(callback2)
    })
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  test('schedules trailing callback during cooldown and only fires latest', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const { result } = renderHook(() => useThrottle(300))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(50)
      result.current(callback2)
      advanceTime(50)
      result.current(callback3)
    })

    expect(callback2).not.toHaveBeenCalled()
    expect(callback3).not.toHaveBeenCalled()

    act(() => {
      advanceTime(200)
    })

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).not.toHaveBeenCalled()
    expect(callback3).toHaveBeenCalledTimes(1)
  })

  test('does not schedule trailing when no calls occur during cooldown', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const { result } = renderHook(() => useThrottle(300))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(300)
    })

    act(() => {
      result.current(callback2)
    })

    expect(callback2).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(300)
    })

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  test('supports throttleMsOverride per call', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const { result } = renderHook(() => useThrottle(300))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(50)
      result.current(callback2, 100)
    })
    expect(callback2).not.toHaveBeenCalled()

    act(() => {
      advanceTime(49)
    })
    expect(callback2).not.toHaveBeenCalled()

    act(() => {
      advanceTime(1)
    })
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  test('clears pending timer on unmount', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const { result, unmount } = renderHook(() => useThrottle(300))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(50)
      result.current(callback2)
    })

    unmount()

    act(() => {
      advanceTime(300)
    })
    expect(callback2).not.toHaveBeenCalled()
  })

  test('cancels pending trailing when leading edge runs after cooldown', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const callback4 = jest.fn()
    const { result } = renderHook(() => useThrottle(300))

    act(() => {
      result.current(callback1)
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(300)
      result.current(callback2)
    })
    expect(callback2).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(10)
      result.current(callback3)
    })
    expect(callback3).not.toHaveBeenCalled()

    act(() => {
      advanceTime(289)
    })

    act(() => {
      setPerformanceTime(600)
      result.current(callback4)
    })

    expect(callback3).not.toHaveBeenCalled()
    expect(callback4).toHaveBeenCalledTimes(1)

    act(() => {
      advanceTime(300)
    })

    expect(callback3).not.toHaveBeenCalled()
    expect(callback4).toHaveBeenCalledTimes(1)
  })
})
