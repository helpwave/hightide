/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMemoryKeyValueStore } from '../../../src/hooks/useMemoryKeyValueStore'
import { useCreateThemeContext } from '../../../src/context/theme/useCreateThemeContext'

describe('useCreateThemeContext', () => {
  type TestTheme = 'light' | 'dark'

  test('resolves theme from controlled prop', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateThemeContext<TestTheme>({
      store,
      fallbackTheme: 'light',
      theme: 'dark',
    }))

    expect(result.current.resolvedTheme).toBe('dark')
    expect(result.current.theme).toBe('dark')
  })

  test('falls back to fallback theme', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateThemeContext<TestTheme>({
      store,
      fallbackTheme: 'light',
    }))

    expect(result.current.resolvedTheme).toBe('light')
    expect(result.current.theme).toBe('system')
  })

  test('prefers system theme over fallback theme', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateThemeContext<TestTheme>({
      store,
      fallbackTheme: 'light',
      systemTheme: 'dark',
    }))

    expect(result.current.resolvedTheme).toBe('dark')
  })

  test('updates stored theme via setTheme', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateThemeContext<TestTheme>({
      store,
      fallbackTheme: 'light',
    }))

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.resolvedTheme).toBe('dark')
    expect(result.current.theme).toBe('dark')
  })

  test('resets to system theme when setTheme receives system', () => {
    const store = useMemoryKeyValueStore()

    const { result } = renderHook(() => useCreateThemeContext<TestTheme>({
      store,
      fallbackTheme: 'light',
    }))

    act(() => {
      result.current.setTheme('dark')
    })

    act(() => {
      result.current.setTheme('system')
    })

    expect(result.current.theme).toBe('system')
    expect(result.current.resolvedTheme).toBe('light')
  })
})
