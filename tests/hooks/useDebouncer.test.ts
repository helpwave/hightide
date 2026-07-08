/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useDebouncer } from '../../src/hooks/useDebouncer'

describe('useDebouncer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('runs callback after default delay', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebouncer())

    act(() => {
      result.current(callback)
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('runs callback after configured delay', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebouncer(200))

    act(() => {
      result.current(callback)
    })

    act(() => {
      jest.advanceTimersByTime(199)
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('resets timer on repeated calls and only fires latest callback', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const { result } = renderHook(() => useDebouncer(300))

    act(() => {
      result.current(callback1)
      jest.advanceTimersByTime(100)
      result.current(callback2)
      jest.advanceTimersByTime(100)
      result.current(callback3)
    })

    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).not.toHaveBeenCalled()
    expect(callback3).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).not.toHaveBeenCalled()
    expect(callback3).toHaveBeenCalledTimes(1)
  })

  test('supports debounceMsOverride per call', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebouncer(300))

    act(() => {
      result.current(callback, 100)
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('clears pending timer on unmount', () => {
    const callback = jest.fn()
    const { result, unmount } = renderHook(() => useDebouncer(300))

    act(() => {
      result.current(callback)
    })

    unmount()

    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(callback).not.toHaveBeenCalled()
  })
})
