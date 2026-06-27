import { useCallback, useEffect, useMemo, useState } from 'react'
import { useControlledState } from '@/src/hooks/useControlledState'

export interface TreeNode {
  id: string,
  items: TreeNode[],
}

export interface TreeItem {
  id: string,
  path: ReadonlyArray<string>,
  expanded: boolean,
}

export interface TreeNavigationOptions {
  nodes: ReadonlyArray<TreeNode>,
  focusedId?: string | null,
  onFocusedIdChange?: (focusedId: string | null) => void,
  initialFocusedId?: string | null,
  onlyOneExpandedTree?: boolean,
}

export interface TreeNavigationActionOptions {
  isFocusing?: boolean,
}

export interface TreeNavigationReturn {
  visibleItems: ReadonlyArray<TreeItem>,
  allItems: ReadonlyArray<TreeItem>,
  focusedItem: TreeItem | null,
  navigateTo: (id: string) => void,
  expand: (id: string, options?: TreeNavigationActionOptions) => void,
  collapse: (id: string, options?: TreeNavigationActionOptions) => void,
  toggleExpansion: (id: string, options?: TreeNavigationActionOptions) => void,
  next: () => void,
  previous: () => void,
  first: () => void,
  last: () => void,
}

interface TreeIndexEntry {
  node: TreeNode,
  parentId: string | null,
  path: string[],
}

interface TreeIndex {
  byId: Map<string, TreeIndexEntry>,
  roots: TreeNode[],
}

function buildTreeIndex(nodes: ReadonlyArray<TreeNode>): TreeIndex {
  const byId = new Map<string, TreeIndexEntry>()

  const walk = (
    nodeList: ReadonlyArray<TreeNode>,
    parentId: string | null,
    parentPath: string[]
  ) => {
    for (const node of nodeList) {
      const path = [...parentPath, node.id]
      if (byId.has(node.id)) {
        console.warn(`Duplicate tree node id: ${node.id}`)
      }
      byId.set(node.id, { node, parentId, path })
      walk(node.items, node.id, path)
    }
  }

  walk(nodes, null, [])

  return {
    byId,
    roots: [...nodes],
  }
}

export function resolveTreeNodePath(
  nodes: ReadonlyArray<TreeNode>,
  id: string | null
): ReadonlyArray<string> | null {
  if (id == null) return null
  const entry = buildTreeIndex(nodes).byId.get(id)
  return entry?.path ?? null
}

function flattenAllItems(
  nodes: ReadonlyArray<TreeNode>,
  expandedIds: ReadonlySet<string>,
  path: string[] = []
): TreeItem[] {
  const result: TreeItem[] = []

  for (const node of nodes) {
    const currentPath = [...path, node.id]
    const hasChildren = node.items.length > 0
    const expanded = hasChildren && expandedIds.has(node.id)

    result.push({ id: node.id, path: currentPath, expanded })
    result.push(...flattenAllItems(node.items, expandedIds, currentPath))
  }

  return result
}

function flattenVisibleItems(
  nodes: ReadonlyArray<TreeNode>,
  expandedIds: ReadonlySet<string>,
  path: string[] = []
): TreeItem[] {
  const result: TreeItem[] = []

  for (const node of nodes) {
    const currentPath = [...path, node.id]
    const hasChildren = node.items.length > 0
    const expanded = hasChildren && expandedIds.has(node.id)

    result.push({ id: node.id, path: currentPath, expanded })

    if (expanded) {
      result.push(...flattenVisibleItems(node.items, expandedIds, currentPath))
    }
  }

  return result
}

function getExpandableAncestorIds(path: ReadonlyArray<string>, index: TreeIndex): string[] {
  return path.slice(0, -1).filter((id) => {
    const entry = index.byId.get(id)
    return entry != null && entry.node.items.length > 0
  })
}

function getDescendantIds(index: TreeIndex, id: string): string[] {
  const entry = index.byId.get(id)
  if (entry == null) return []

  const result: string[] = []

  const walk = (nodeList: ReadonlyArray<TreeNode>) => {
    for (const node of nodeList) {
      result.push(node.id)
      walk(node.items)
    }
  }

  walk(entry.node.items)
  return result
}

function isAncestorOf(ancestorId: string, descendantPath: ReadonlyArray<string>): boolean {
  const index = descendantPath.indexOf(ancestorId)
  return index >= 0 && index < descendantPath.length - 1
}

function pruneExpandedIds(
  expandedIds: ReadonlySet<string>,
  focusedPath: ReadonlyArray<string> | null,
  onlyOneExpandedTree: boolean,
  index: TreeIndex
): Set<string> {
  if (!onlyOneExpandedTree || focusedPath == null) {
    return new Set(expandedIds)
  }

  const pathSet = new Set(focusedPath)
  const pruned = new Set<string>()

  for (const id of expandedIds) {
    if (!pathSet.has(id)) continue
    const entry = index.byId.get(id)
    if (entry != null && entry.node.items.length > 0) {
      pruned.add(id)
    }
  }

  return pruned
}

function syncExpansionForFocused(
  expandedIds: ReadonlySet<string>,
  focusedPath: ReadonlyArray<string>,
  onlyOneExpandedTree: boolean,
  index: TreeIndex
): Set<string> {
  const next = new Set(expandedIds)

  for (const id of getExpandableAncestorIds(focusedPath, index)) {
    next.add(id)
  }

  return pruneExpandedIds(next, focusedPath, onlyOneExpandedTree, index)
}

export function useTreeNavigation({
  nodes,
  focusedId: controlledFocusedId,
  onFocusedIdChange,
  initialFocusedId,
  onlyOneExpandedTree = false,
}: TreeNavigationOptions): TreeNavigationReturn {
  const index = useMemo(() => buildTreeIndex(nodes), [nodes])

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

  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set())

  useEffect(() => {
    if (resolvedFocusedId == null) return
    const entry = index.byId.get(resolvedFocusedId)
    if (entry == null) return
    setExpandedIds((prev) => syncExpansionForFocused(prev, entry.path, onlyOneExpandedTree, index))
  }, [resolvedFocusedId, onlyOneExpandedTree, index])

  const visibleItems = useMemo(() => {
    return flattenVisibleItems(nodes, expandedIds)
  }, [nodes, expandedIds])

  const allItems = useMemo(() => {
    return flattenAllItems(nodes, expandedIds)
  }, [nodes, expandedIds])

  const focusedItem = useMemo(() => {
    if (resolvedFocusedId == null) return null
    return allItems.find((item) => item.id === resolvedFocusedId) ?? null
  }, [allItems, resolvedFocusedId])

  const navigateTo = useCallback((id: string) => {
    const entry = index.byId.get(id)
    if (entry == null) {
      console.warn(`Attempted to navigate to node ${id} that does not exist`)
      return
    }
    setFocusedId(id)
    setExpandedIds((prev) => {
      const next = syncExpansionForFocused(prev, entry.path, onlyOneExpandedTree, index)
      return next
    })
  }, [index, onlyOneExpandedTree, setFocusedId])

  const expand = useCallback((id: string, options?: TreeNavigationActionOptions) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    if (options?.isFocusing) {
      setFocusedId(id)
    }

    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      const focusedPath = options?.isFocusing
        ? entry.path
        : resolvedFocusedId != null
          ? index.byId.get(resolvedFocusedId)?.path ?? null
          : null
      return pruneExpandedIds(next, focusedPath, onlyOneExpandedTree, index)
    })
  }, [index, onlyOneExpandedTree, resolvedFocusedId, setFocusedId])

  const collapse = useCallback((id: string, options?: TreeNavigationActionOptions) => {
    if (!options?.isFocusing && resolvedFocusedId != null) {
      const focusedEntry = index.byId.get(resolvedFocusedId)
      if (focusedEntry != null && isAncestorOf(id, focusedEntry.path)) return
    }

    if (options?.isFocusing) {
      setFocusedId(id)
    }

    const descendantIds = getDescendantIds(index, id)
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      for (const descendantId of descendantIds) {
        next.delete(descendantId)
      }
      return next
    })
  }, [index, resolvedFocusedId, setFocusedId])

  const toggleExpansion = useCallback((id: string, options?: TreeNavigationActionOptions) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    if (options?.isFocusing) {
      setFocusedId(id)
      setExpandedIds((prev) => {
        if (prev.has(id)) {
          const next = new Set(prev)
          next.delete(id)
          for (const descendantId of getDescendantIds(index, id)) {
            next.delete(descendantId)
          }
          return next
        }

        const next = new Set(prev)
        next.add(id)
        for (const ancestorId of getExpandableAncestorIds(entry.path, index)) {
          next.add(ancestorId)
        }
        return pruneExpandedIds(next, entry.path, onlyOneExpandedTree, index)
      })
      return
    }

    const isExpanded = expandedIds.has(id)
    if (isExpanded) {
      collapse(id)
    } else {
      expand(id)
    }
  }, [index, expandedIds, expand, collapse, onlyOneExpandedTree, setFocusedId])

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
      return
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
      return
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

  return useMemo((): TreeNavigationReturn => ({
    visibleItems,
    allItems,
    focusedItem,
    navigateTo,
    expand,
    collapse,
    toggleExpansion,
    next,
    previous,
    first,
    last,
  }), [visibleItems, allItems, focusedItem, navigateTo, expand, collapse, toggleExpansion, next, previous, first, last])
}
