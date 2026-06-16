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

    expect(result.current.items.map((item) => item.id)).toEqual(['root-a', 'root-b'])
    expect(result.current.items.every((item) => !item.expanded)).toBe(true)
    expect(result.current.activeItem).toBeNull()
  })

  test('hides children when parent is collapsed', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'root-a',
      }))

    expect(result.current.items.map((item) => item.id)).toEqual(['root-a', 'root-b'])
  })

  test('navigateTo expands ancestors and exposes activeItem path', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    act(() => {
      result.current.navigateTo('child-a2')
    })

    expect(result.current.activeItem).toEqual({
      id: 'child-a2',
      path: ['root-a', 'child-a2'],
      expanded: false,
    })
    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.items[0]?.expanded).toBe(true)
  })

  test('uses initialActiveId when uncontrolled', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-b1',
      }))

    expect(result.current.activeItem?.id).toBe('child-b1')
    expect(result.current.activeItem?.path).toEqual(['root-b', 'child-b1'])
    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'root-b',
      'child-b1',
    ])
  })

  test('controlled activeId follows prop', () => {
    const onActiveIdChange = jest.fn()
    const { result, rerender } = renderHook(
      (props: { activeId: string | null }) =>
        useTreeNavigation({
          nodes: sampleTree,
          activeId: props.activeId,
          onActiveIdChange,
        }),
      { initialProps: { activeId: 'root-a' as string | null } },
    )

    expect(result.current.activeItem?.id).toBe('root-a')

    rerender({ activeId: 'child-a1' })

    expect(result.current.activeItem?.id).toBe('child-a1')
    expect(result.current.activeItem?.path).toEqual(['root-a', 'child-a1'])
  })

  test('onlyOneExpandedTree keeps only active path branches expanded', () => {
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

    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.items.find((item) => item.id === 'root-b')?.expanded).toBe(false)

    act(() => {
      result.current.navigateTo('child-b1')
    })

    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'root-b',
      'child-b1',
    ])
    expect(result.current.items.find((item) => item.id === 'root-a')?.expanded).toBe(false)
    expect(result.current.items.find((item) => item.id === 'root-b')?.expanded).toBe(true)
  })

  test('expand reveals children and collapse hides descendants', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    act(() => {
      result.current.expand('root-a')
    })

    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])

    act(() => {
      result.current.collapse('root-a')
    })

    expect(result.current.items.map((item) => item.id)).toEqual(['root-a', 'root-b'])
  })

  test('collapse does not collapse ancestor of active node', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-a1',
      }))

    act(() => {
      result.current.collapse('root-a')
    })

    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.items.find((item) => item.id === 'root-a')?.expanded).toBe(true)
  })

  test('next moves to next visible item in flattened tree order', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'root-a',
      }))

    act(() => {
      result.current.next()
    })

    expect(result.current.activeItem?.id).toBe('root-b')
  })

  test('previous moves to previous visible item in flattened tree order', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-a2',
      }))

    act(() => {
      result.current.previous()
    })

    expect(result.current.activeItem?.id).toBe('child-a1')
  })

  test('next loops to first visible item when isNextLooping is true', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-b1',
        isNextLooping: true,
      }))

    act(() => {
      result.current.next()
    })

    expect(result.current.activeItem?.id).toBe('root-a')
  })

  test('next does not pass last visible item when isNextLooping is false', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-b1',
        isNextLooping: false,
      }))

    act(() => {
      result.current.next()
    })

    expect(result.current.activeItem?.id).toBe('child-b1')
  })

  test('previous loops to last visible item when isNextLooping is true', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'root-a',
        isNextLooping: true,
      }))

    act(() => {
      result.current.previous()
    })

    expect(result.current.activeItem?.id).toBe('root-b')
  })

  test('first navigates to first visible item', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'child-b1',
      }))

    act(() => {
      result.current.first()
    })

    expect(result.current.activeItem?.id).toBe('root-a')
  })

  test('last navigates to last visible item', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'root-a',
      }))

    act(() => {
      result.current.last()
    })

    expect(result.current.activeItem?.id).toBe('root-b')
  })

  test('navigateTo with expandIfBranch expands branch nodes immediately', () => {
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: sampleTree }))

    act(() => {
      result.current.navigateTo('root-a', { expandIfBranch: true })
    })

    expect(result.current.activeItem?.id).toBe('root-a')
    expect(result.current.items.map((item) => item.id)).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
    ])
    expect(result.current.items.find((item) => item.id === 'root-a')?.expanded).toBe(true)
  })

  test('navigateTo ignores invalid id', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() =>
      useTreeNavigation({
        nodes: sampleTree,
        initialActiveId: 'root-a',
      }))

    act(() => {
      result.current.navigateTo('missing')
    })

    expect(result.current.activeItem?.id).toBe('root-a')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  test('empty tree yields empty items and no-op actions', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() =>
      useTreeNavigation({ nodes: [] }))

    expect(result.current.items).toEqual([])
    expect(result.current.activeItem).toBeNull()

    act(() => {
      result.current.navigateTo('any')
      result.current.next()
      result.current.previous()
      result.current.first()
      result.current.last()
      result.current.expand('any')
      result.current.collapse('any')
    })

    expect(result.current.items).toEqual([])
    expect(result.current.activeItem).toBeNull()
    warn.mockRestore()
  })
})
