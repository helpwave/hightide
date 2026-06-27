/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { type TreeNode, useTreeNavigation } from '../../src/hooks/useTreeNavigation'

const sampleTree: TreeNode[] = [
  {
    id: 'root-a',
    items: [
      { id: 'child-a1', items: [] },
      { id: 'child-a2', items: [] },
    ],
  },
  {
    id: 'root-b',
    items: [
      { id: 'child-b1', items: [] },
    ],
  },
]

describe('useTreeNavigation', () => {
  test('flattens root nodes when nothing is expanded', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    expect(result.current.visibleItems.map((item) => item.id)).toEqual(['root-a', 'root-b'])
    expect(result.current.visibleItems.every((item) => !item.expanded)).toBe(true)
    expect(result.current.focusedItem).toBeNull()
  })

  test('hides children when parent is collapsed', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'root-a',
      }))

    expect(result.current.visibleItems.map((item) => item.id)).toEqual(['root-a', 'root-b'])
  })

  test('navigateTo expands ancestors and exposes focusedItem path', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    act(() => {
      result.current.navigateTo('child-a2')
    })

    expect(result.current.focusedItem).toEqual({
      id: 'child-a2',
      path: ['root-a', 'child-a2'],
      expanded: false,
    })
    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.visibleItems[0]?.expanded).toBe(true)
  })

  test('uses initialFocusedId when uncontrolled', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'child-b1',
      }))

    expect(result.current.focusedItem?.id).toBe('child-b1')
    expect(result.current.focusedItem?.path).toEqual(['root-b', 'child-b1'])
    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'root-b',
      'child-b1',
    ])
  })

  test('controlled focusedId follows prop', () => {
    const onFocusedIdChange = jest.fn()
    const { result, rerender } = renderHook(
      (props: { focusedId: string | null }) =>
        useTreeNavigation({
          nodes: sampleTree,
          focusedId: props.focusedId,
          onFocusedIdChange,
        }),
      { initialProps: { focusedId: 'root-a' as string | null } }
    )

    expect(result.current.focusedItem?.id).toBe('root-a')

    rerender({ focusedId: 'child-a1' })

    expect(result.current.focusedItem?.id).toBe('child-a1')
    expect(result.current.focusedItem?.path).toEqual(['root-a', 'child-a1'])
  })

  test('onlyOneExpandedTree keeps only focused path branches expanded', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        onlyOneExpandedTree: true,
      }))

    act(() => {
      result.current.navigateTo('child-a1')
    })
    act(() => {
      result.current.expand('root-b')
    })

    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.visibleItems.find((item) => item.id === 'root-b')?.expanded).toBe(false)

    act(() => {
      result.current.navigateTo('child-b1')
    })

    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'root-b',
      'child-b1',
    ])
    expect(result.current.visibleItems.find((item) => item.id === 'root-a')?.expanded).toBe(false)
    expect(result.current.visibleItems.find((item) => item.id === 'root-b')?.expanded).toBe(true)
  })

  test('expand reveals children and collapse hides descendants', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    act(() => {
      result.current.expand('root-a')
    })

    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])

    act(() => {
      result.current.collapse('root-a')
    })

    expect(result.current.visibleItems.map((item) => item.id)).toEqual(['root-a', 'root-b'])
  })

  test('collapse does not collapse ancestor of focused node', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'child-a1',
      }))

    act(() => {
      result.current.collapse('root-a')
    })

    expect(result.current.visibleItems.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.visibleItems.find((item) => item.id === 'root-a')?.expanded).toBe(true)
  })

  test('toggleExpansion with isFocusing collapses parent after activating a descendant', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'child-a1',
      }))

    act(() => {
      result.current.toggleExpansion('root-a', { isFocusing: true })
    })

    expect(result.current.focusedItem?.id).toBe('root-a')
    expect(result.current.visibleItems.map((item) => item.id)).toEqual(['root-a', 'root-b'])
    expect(result.current.visibleItems.find((item) => item.id === 'root-a')?.expanded).toBe(false)
  })

  test('next moves to next visible item in flattened tree order', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'root-a',
      }))

    act(() => {
      result.current.next()
    })

    expect(result.current.focusedItem?.id).toBe('root-b')
  })

  test('previous moves to previous visible item in flattened tree order', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'child-a2',
      }))

    act(() => {
      result.current.previous()
    })

    expect(result.current.focusedItem?.id).toBe('child-a1')
  })

  test('first navigates to first visible item', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'child-b1',
      }))

    act(() => {
      result.current.first()
    })

    expect(result.current.focusedItem?.id).toBe('root-a')
  })

  test('last navigates to last visible item', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'root-a',
      }))

    act(() => {
      result.current.last()
    })

    expect(result.current.focusedItem?.id).toBe('root-b')
  })

  test('navigateTo ignores invalid id', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialFocusedId: 'root-a',
      }))

    act(() => {
      result.current.navigateTo('missing')
    })

    expect(result.current.focusedItem?.id).toBe('root-a')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  test('allItems includes collapsed descendants', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    expect(result.current.visibleItems.map((item) => item.id)).toEqual(['root-a', 'root-b'])
    expect(result.current.allItems.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
      'child-b1',
    ])
  })

  test('empty tree yields empty items and no-op actions', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: [] }))

    expect(result.current.visibleItems).toEqual([])
    expect(result.current.allItems).toEqual([])
    expect(result.current.focusedItem).toBeNull()

    act(() => {
      result.current.navigateTo('any')
      result.current.next()
      result.current.previous()
      result.current.first()
      result.current.last()
      result.current.expand('any')
      result.current.collapse('any')
    })

    expect(result.current.visibleItems).toEqual([])
    expect(result.current.allItems).toEqual([])
    expect(result.current.focusedItem).toBeNull()
    warn.mockRestore()
  })
})
