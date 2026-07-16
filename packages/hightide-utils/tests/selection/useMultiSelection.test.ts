/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { useMultiSelection } from '../../src/hooks/useMultiSelection'

const baseOptions = [
  { id: 'a' },
  { id: 'b' },
  { id: 'c' },
] as const

describe('useMultiSelection', () => {
  test('uses initialSelection when uncontrolled', () => {
    const { result } = renderHook(() =>
      useMultiSelection({
        options: baseOptions,
        initialSelection: ['a', 'c'],
      }))
    expect(result.current.selection).toEqual(['a', 'c'])
    expect(result.current.isSelected('a')).toBe(true)
    expect(result.current.isSelected('b')).toBe(false)
  })

  test('toggleSelection adds and removes id', () => {
    const { result } = renderHook(() =>
      useMultiSelection({
        options: baseOptions,
        initialSelection: [],
      }))
    act(() => {
      result.current.toggleSelection('b')
    })
    expect(result.current.selection).toEqual(['b'])
    expect(result.current.isSelected('b')).toBe(true)
    act(() => {
      result.current.toggleSelection('b')
    })
    expect(result.current.selection).toEqual([])
  })

  test('toggleSelection ignores unknown or disabled id', () => {
    const { result } = renderHook(() =>
      useMultiSelection({
        options: [{ id: 'a' }, { id: 'b', disabled: true }] as const,
        initialSelection: ['a'],
      }))
    act(() => {
      result.current.toggleSelection('missing')
    })
    expect(result.current.selection).toEqual(['a'])
    act(() => {
      result.current.toggleSelection('b')
    })
    expect(result.current.selection).toEqual(['a'])
  })

  test('setSelection replaces selection', () => {
    const { result } = renderHook(() =>
      useMultiSelection({
        options: baseOptions,
        initialSelection: ['a'],
      }))
    act(() => {
      result.current.setSelection(['b', 'c'])
    })
    expect(result.current.selection).toEqual(['b', 'c'])
  })

  test('controlled value follows prop', () => {
    const onSelectionChange = jest.fn()
    const { result, rerender } = renderHook(
      (props: { value: readonly string[] }) =>
        useMultiSelection({
          options: baseOptions,
          value: props.value,
          onSelectionChange,
        }),
      { initialProps: { value: ['a'] as readonly string[] } }
    )
    expect(result.current.selection).toEqual(['a'])
    rerender({ value: ['b', 'c'] })
    expect(result.current.selection).toEqual(['b', 'c'])
  })
})
