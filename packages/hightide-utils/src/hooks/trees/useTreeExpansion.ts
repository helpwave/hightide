import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useControlledState } from '../useControlledState'
import type { TreeItem, TreeNode } from './types'
import { TreeUtilities } from './treeUtilities'

export interface TreeExpansionOptions {
  nodes: ReadonlyArray<TreeNode>,
  onlyOneExpandedTree?: boolean,
  expandedIds?: ReadonlySet<string>,
  onExpandedIdsChange?: (expandedIds: ReadonlySet<string>) => void,
  initialExpandedIds?: ReadonlySet<string>,
  pruneCollapsedSubtrees?: boolean,
}

export interface TreeExpansionActionOptions {
  focusedPath?: ReadonlyArray<string> | null,
  focusedId?: string | null,
}

export interface TreeExpansionReturn {
  visibleItems: ReadonlyArray<TreeItem>,
  allItems: ReadonlyArray<TreeItem>,
  expandedIds: ReadonlySet<string>,
  setExpandedIds: React.Dispatch<React.SetStateAction<ReadonlySet<string>>>,
  expand: (id: string, options?: TreeExpansionActionOptions) => void,
  collapse: (id: string, options?: TreeExpansionActionOptions) => void,
  toggleExpansion: (id: string, options?: TreeExpansionActionOptions) => void,
  expandForPath: (path: ReadonlyArray<string>) => void,
}


export function useTreeExpansion({
  nodes,
  onlyOneExpandedTree = false,
  expandedIds: controlledExpandedIds,
  onExpandedIdsChange,
  initialExpandedIds,
  pruneCollapsedSubtrees = true,
}: TreeExpansionOptions): TreeExpansionReturn {
  const index = useMemo(() => TreeUtilities.buildTreeIndex(nodes), [nodes])
  const [expandedIds, setExpandedIds] = useControlledState<ReadonlySet<string>>({
    value: controlledExpandedIds,
    onValueChange: onExpandedIdsChange,
    defaultValue: initialExpandedIds ?? new Set(),
  })

  const visibleItems = useMemo(() => {
    return TreeUtilities.flattenVisibleItems(nodes, expandedIds)
  }, [nodes, expandedIds])

  const allItems = useMemo(() => {
    return TreeUtilities.flattenAllItems(nodes, expandedIds)
  }, [nodes, expandedIds])

  const removeCollapsedSubtree = useCallback((expanded: ReadonlySet<string>, id: string) => {
    const next = new Set(expanded)
    next.delete(id)
    if (pruneCollapsedSubtrees) {
      for (const descendantId of TreeUtilities.getDescendantIds(index, id)) {
        next.delete(descendantId)
      }
    }
    return TreeUtilities.areExpandedIdsEqual(expanded, next) ? expanded : next
  }, [index, pruneCollapsedSubtrees])

  const expandForPath = useCallback((path: ReadonlyArray<string>) => {
    setExpandedIds((prev) => TreeUtilities.syncExpansionForFocused(prev, path, onlyOneExpandedTree, index))
  }, [index, onlyOneExpandedTree, setExpandedIds])

  const expand = useCallback((id: string, options?: TreeExpansionActionOptions) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      const pruned = TreeUtilities.pruneExpandedIds(next, options?.focusedPath ?? null, onlyOneExpandedTree, index)
      return TreeUtilities.areExpandedIdsEqual(prev, pruned) ? prev : pruned
    })
  }, [index, onlyOneExpandedTree, setExpandedIds])

  const collapse = useCallback((id: string, options?: TreeExpansionActionOptions) => {
    if (options?.focusedId != null) {
      const focusedEntry = index.byId.get(options.focusedId)
      if (focusedEntry != null && TreeUtilities.isAncestorOf(id, focusedEntry.path)) return
    }

    setExpandedIds((prev) => removeCollapsedSubtree(prev, id))
  }, [index, removeCollapsedSubtree, setExpandedIds])

  const toggleExpansion = useCallback((id: string, options?: TreeExpansionActionOptions) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    setExpandedIds((prev) => {
      if (prev.has(id)) {
        return removeCollapsedSubtree(prev, id)
      }

      const next = new Set(prev)
      next.add(id)
      for (const ancestorId of TreeUtilities.getExpandableAncestorIds(entry.path, index)) {
        next.add(ancestorId)
      }
      const pruned = TreeUtilities.pruneExpandedIds(next, options?.focusedPath ?? entry.path, onlyOneExpandedTree, index)
      return TreeUtilities.areExpandedIdsEqual(prev, pruned) ? prev : pruned
    })
  }, [index, onlyOneExpandedTree, removeCollapsedSubtree, setExpandedIds])

  return useMemo((): TreeExpansionReturn => ({
    visibleItems,
    allItems,
    expandedIds,
    setExpandedIds,
    expand,
    collapse,
    toggleExpansion,
    expandForPath,
  }), [visibleItems, allItems, expandedIds, setExpandedIds, expand, collapse, toggleExpansion, expandForPath])
}
