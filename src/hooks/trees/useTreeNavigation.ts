import { useCallback, useEffect, useMemo } from 'react'
import { useTreeExpansion, type TreeExpansionOptions, type TreeExpansionReturn } from './useTreeExpansion'
import { useTreeFocusNavigation, type TreeFocusNavigationReturn } from './useTreeFocusNavigation'
import { TreeUtilities } from './treeUtilities'

export interface TreeNavigationOptions extends TreeExpansionOptions {
  focusedId?: string | null,
  onFocusedIdChange?: (focusedId: string | null) => void,
  initialFocusedId?: string | null,
}

export interface TreeNavigationActionOptions {
  isFocusing?: boolean,
}

export interface TreeNavigationReturn extends
  Omit<TreeExpansionReturn, 'expand'|'collapse'|'toggleExpansion'>,
  Omit<TreeFocusNavigationReturn, 'setFocusedId'> {
    expand: (id: string, options?: TreeNavigationActionOptions) => void,
    collapse: (id: string, options?: TreeNavigationActionOptions) => void,
    toggleExpansion: (id: string, options?: TreeNavigationActionOptions) => void,
  }


export function useTreeNavigation({
  nodes,
  focusedId: controlledFocusedId,
  onFocusedIdChange,
  initialFocusedId,
  onlyOneExpandedTree = false,
  ...expansionOptions
}: TreeNavigationOptions): TreeNavigationReturn {
  const index = useMemo(() => TreeUtilities.buildTreeIndex(nodes), [nodes])
  const expansion = useTreeExpansion({ nodes, onlyOneExpandedTree, ...expansionOptions })

  const { expandForPath } = expansion

  const handleNavigate = useCallback((_id: string, path: ReadonlyArray<string>) => {
    expandForPath(path)
  }, [expandForPath])

  const focus = useTreeFocusNavigation({
    nodes,
    visibleItems: expansion.visibleItems,
    focusedId: controlledFocusedId,
    onFocusedIdChange,
    initialFocusedId,
    onNavigate: handleNavigate,
  })

  useEffect(() => {
    if (focus.focusedId == null) return
    const entry = index.byId.get(focus.focusedId)
    if (entry == null) return
    expandForPath(entry.path)
  }, [focus.focusedId, index, expandForPath])

  const getFocusedPath = useCallback(() => {
    if (focus.focusedId == null) return null
    return index.byId.get(focus.focusedId)?.path ?? null
  }, [focus.focusedId, index])

  const expand = useCallback((id: string, options?: TreeNavigationActionOptions | undefined) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    if (options?.isFocusing) {
      focus.setFocusedId(id)
    }

    expansion.expand(id, {
      focusedPath: options?.isFocusing
        ? entry.path
        : getFocusedPath(),
      focusedId: focus.focusedId,
    })
  }, [index, expansion, focus, getFocusedPath])

  const collapse = useCallback((id: string, options?: TreeNavigationActionOptions | undefined) => {
    if (options?.isFocusing) {
      focus.setFocusedId(id)
    }

    expansion.collapse(id, {
      focusedId: options?.isFocusing ? null : focus.focusedId,
    })
  }, [expansion, focus])

  const toggleExpansion = useCallback((id: string, options?: TreeNavigationActionOptions | undefined) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    if (options?.isFocusing) {
      focus.setFocusedId(id)
      expansion.toggleExpansion(id, { focusedPath: entry.path })
      return
    }

    const isExpanded = expansion.expandedIds.has(id)
    if (isExpanded) {
      expansion.collapse(id, { focusedId: focus.focusedId })
    } else {
      expansion.expand(id, {
        focusedPath: getFocusedPath(),
        focusedId: focus.focusedId,
      })
    }
  }, [index, expansion, focus, getFocusedPath])

  return useMemo((): TreeNavigationReturn => ({
    visibleItems: expansion.visibleItems,
    allItems: expansion.allItems,
    expandedIds: expansion.expandedIds,
    setExpandedIds: expansion.setExpandedIds,
    expand,
    collapse,
    toggleExpansion,
    expandForPath: expansion.expandForPath,
    focusedId: focus.focusedId,
    focusedItem: focus.focusedItem,
    navigateTo: focus.navigateTo,
    next: focus.next,
    previous: focus.previous,
    first: focus.first,
    last: focus.last,
  }), [expansion, expand, collapse, toggleExpansion, focus])
}
