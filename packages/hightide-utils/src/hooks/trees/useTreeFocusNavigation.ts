import { useCallback, useMemo } from 'react'
import { useControlledState } from '../useControlledState'
import type { TreeItem, TreeNode } from './types'
import { TreeUtilities } from './treeUtilities'

export interface TreeFocusNavigationOptions {
  nodes: ReadonlyArray<TreeNode>,
  visibleItems: ReadonlyArray<TreeItem>,
  focusedId?: string | null,
  onFocusedIdChange?: (focusedId: string | null) => void,
  initialFocusedId?: string | null,
  onNavigate?: (id: string, path: ReadonlyArray<string>) => void,
}

export interface TreeFocusNavigationReturn {
  focusedId: string | null,
  focusedItem: TreeItem | null,
  setFocusedId: (focusedId: string | null) => void,
  navigateTo: (id: string) => void,
  next: () => void,
  previous: () => void,
  first: () => void,
  last: () => void,
}

export function useTreeFocusNavigation({
  nodes,
  visibleItems,
  focusedId: controlledFocusedId,
  onFocusedIdChange,
  initialFocusedId,
  onNavigate,
}: TreeFocusNavigationOptions): TreeFocusNavigationReturn {
  const index = useMemo(() => TreeUtilities.buildTreeIndex(nodes), [nodes])

  const [focusedId, setFocusedId] = useControlledState<string | null>({
    value: controlledFocusedId,
    onValueChange: onFocusedIdChange,
    defaultValue: initialFocusedId ?? null,
  })

  const resolvedFocusedId = useMemo(() => {
    if (focusedId == null) return null
    if (index.byId.has(focusedId)) return focusedId
    return null
  }, [focusedId, index])

  const focusedItem = useMemo(() => {
    if (resolvedFocusedId == null) return null
    return visibleItems.find((item) => item.id === resolvedFocusedId)
      ?? { id: resolvedFocusedId, path: index.byId.get(resolvedFocusedId)?.path ?? [], expanded: false }
  }, [visibleItems, resolvedFocusedId, index])

  const navigateTo = useCallback((id: string) => {
    const entry = index.byId.get(id)
    if (entry == null) {
      console.warn(`Attempted to navigate to node ${id} that does not exist`)
      return
    }
    setFocusedId(id)
    onNavigate?.(id, entry.path)
  }, [index, onNavigate, setFocusedId])

  const next = useCallback(() => {
    if (visibleItems.length === 0) return

    if (resolvedFocusedId == null) {
      navigateTo(visibleItems[0].id)
      return
    }

    const currentIndex = visibleItems.findIndex((item) => item.id === resolvedFocusedId)
    const startIndex = currentIndex < 0 ? 0 : currentIndex

    if (startIndex < visibleItems.length - 1) {
      navigateTo(visibleItems[startIndex + 1].id)
    }
  }, [visibleItems, resolvedFocusedId, navigateTo])

  const previous = useCallback(() => {
    if (visibleItems.length === 0) return

    if (resolvedFocusedId == null) {
      navigateTo(visibleItems[visibleItems.length - 1].id)
      return
    }

    const currentIndex = visibleItems.findIndex((item) => item.id === resolvedFocusedId)
    const startIndex = currentIndex < 0 ? visibleItems.length - 1 : currentIndex

    if (startIndex > 0) {
      navigateTo(visibleItems[startIndex - 1].id)
    }
  }, [visibleItems, resolvedFocusedId, navigateTo])

  const first = useCallback(() => {
    if (visibleItems.length === 0) return
    navigateTo(visibleItems[0].id)
  }, [visibleItems, navigateTo])

  const last = useCallback(() => {
    if (visibleItems.length === 0) return
    navigateTo(visibleItems[visibleItems.length - 1].id)
  }, [visibleItems, navigateTo])

  return useMemo((): TreeFocusNavigationReturn => ({
    focusedId: resolvedFocusedId,
    focusedItem,
    setFocusedId,
    navigateTo,
    next,
    previous,
    first,
    last,
  }), [resolvedFocusedId, focusedItem, setFocusedId, navigateTo, next, previous, first, last])
}
