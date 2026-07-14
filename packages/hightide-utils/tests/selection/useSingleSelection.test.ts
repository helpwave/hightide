/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useSingleSelection } from '../../src/hooks/useSingleSelection'

const baseOptions = [
  { id: 'a' },
  { id: 'b' },
  { id: 'c' },
] as const

describe('useSingleSelection', () => {
  test('uses initialSelection when uncontrolled', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: 'b',
      }))
    expect(result.current.selection).toBe('b')
    expect(result.current.selectedIndex).toBe(1)
  })

  test('selectValue sets enabled id and null clears', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: null,
      }))
    act(() => {
      result.current.selectValue('c')
    })
    expect(result.current.selection).toBe('c')
    act(() => {
      result.current.selectValue(null)
    })
    expect(result.current.selection).toBeNull()
  })

  test('selectValue ignores invalid or disabled id', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const options = [{ id: 'a' }, { id: 'x', disabled: true }] as const
    const { result } = renderHook(() =>
      useSingleSelection({
        options,
        initialSelection: 'a',
      }))
    act(() => {
      result.current.selectValue('missing')
    })
    expect(result.current.selection).toBe('a')
    act(() => {
      result.current.selectValue('x')
    })
    expect(result.current.selection).toBe('a')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  test('selectByIndex selects by position', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: null,
      }))
    act(() => {
      result.current.selectByIndex(0)
    })
    expect(result.current.selection).toBe('a')
  })

  test('selectByIndex ignores invalid index or disabled option', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const options = [{ id: 'a' }, { id: 'b', disabled: true }] as const
    const { result } = renderHook(() =>
      useSingleSelection({
        options,
        initialSelection: 'a',
      }))
    act(() => {
      result.current.selectByIndex(99)
    })
    expect(result.current.selection).toBe('a')
    act(() => {
      result.current.selectByIndex(1)
    })
    expect(result.current.selection).toBe('a')
    warn.mockRestore()
  })

  test('selectFirst and selectLast skip disabled', () => {
    const options = [
      { id: 'a', disabled: true },
      { id: 'b' },
      { id: 'c', disabled: true },
      { id: 'd' },
    ] as const
    const { result } = renderHook(() =>
      useSingleSelection({
        options,
        initialSelection: null,
      }))
    act(() => {
      result.current.selectFirst()
    })
    expect(result.current.selection).toBe('b')
    act(() => {
      result.current.selectLast()
    })
    expect(result.current.selection).toBe('d')
  })

  test('selectNext loops to first when isLooping is true', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: 'c',
        isLooping: true,
      }))
    act(() => {
      result.current.selectNext()
    })
    expect(result.current.selection).toBe('a')
  })

  test('selectNext does not pass last when isLooping is false', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: 'c',
        isLooping: false,
      }))
    act(() => {
      result.current.selectNext()
    })
    expect(result.current.selection).toBe('c')
  })

  test('selectPrevious loops from first to last when isLooping is true', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: 'a',
        isLooping: true,
      }))
    act(() => {
      result.current.selectPrevious()
    })
    expect(result.current.selection).toBe('c')
  })

  test('selectPrevious stays at first when isLooping is false', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: 'a',
        isLooping: false,
      }))
    act(() => {
      result.current.selectPrevious()
    })
    expect(result.current.selection).toBe('a')
  })

  test('when no selection selectNext treats index as zero then advances', () => {
    const { result } = renderHook(() =>
      useSingleSelection({
        options: baseOptions,
        initialSelection: null,
      }))
    act(() => {
      result.current.selectNext()
    })
    expect(result.current.selection).toBe('b')
  })

  test('controlled selection follows prop', () => {
    const onSelectionChange = jest.fn()
    const { result, rerender } = renderHook(
      (props: { selection: string | null }) =>
        useSingleSelection({
          options: baseOptions,
          selection: props.selection,
          onSelectionChange,
        }),
      { initialProps: { selection: 'a' as string | null } }
    )
    expect(result.current.selection).toBe('a')
    rerender({ selection: 'b' })
    expect(result.current.selection).toBe('b')
  })
})
