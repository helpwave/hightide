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
  activeId?: string | null,
  onActiveIdChange?: (activeId: string | null) => void,
  initialActiveId?: string | null,
  onlyOneExpandedTree?: boolean,
}

export interface TreeNavigationReturn {
  items: ReadonlyArray<TreeItem>,
  activeItem: TreeItem | null,
  navigateTo: (id: string) => void,
  expand: (id: string) => void,
  collapse: (id: string) => void,
  toggleExpansion: (id: string) => void,
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
  activePath: ReadonlyArray<string> | null,
  onlyOneExpandedTree: boolean,
  index: TreeIndex
): Set<string> {
  if (!onlyOneExpandedTree || activePath == null) {
    return new Set(expandedIds)
  }

  const pathSet = new Set(activePath)
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

function syncExpansionForActive(
  expandedIds: ReadonlySet<string>,
  activePath: ReadonlyArray<string>,
  onlyOneExpandedTree: boolean,
  index: TreeIndex
): Set<string> {
  const next = new Set(expandedIds)

  for (const id of getExpandableAncestorIds(activePath, index)) {
    next.add(id)
  }

  return pruneExpandedIds(next, activePath, onlyOneExpandedTree, index)
}

export function useTreeNavigation({
  nodes,
  activeId: controlledActiveId,
  onActiveIdChange,
  initialActiveId,
  onlyOneExpandedTree = false,
}: TreeNavigationOptions): TreeNavigationReturn {
  const index = useMemo(() => buildTreeIndex(nodes), [nodes])

  const [activeId, setActiveId] = useControlledState<string | null>({
    value: controlledActiveId,
    onValueChange: onActiveIdChange,
    defaultValue: initialActiveId ?? null,
  })

  const resolvedActiveId = useMemo(() => {
    if (activeId == null) return null
    if (index.byId.has(activeId)) return activeId
    return null
  }, [activeId, index])

  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set())

  useEffect(() => {
    if (resolvedActiveId == null) return
    const entry = index.byId.get(resolvedActiveId)
    if (entry == null) return
    setExpandedIds((prev) => syncExpansionForActive(prev, entry.path, onlyOneExpandedTree, index))
  }, [resolvedActiveId, onlyOneExpandedTree, index])

  const items = useMemo(() => {
    return flattenVisibleItems(nodes, expandedIds)
  }, [nodes, expandedIds])

  const activeItem = useMemo(() => {
    if (resolvedActiveId == null) return null
    return items.find((item) => item.id === resolvedActiveId) ?? null
  }, [items, resolvedActiveId])

  const navigateTo = useCallback((id: string) => {
    const entry = index.byId.get(id)
    if (entry == null) {
      console.warn(`Attempted to navigate to node ${id} that does not exist`)
      return
    }
    setActiveId(id)
    setExpandedIds((prev) => {
      const next = syncExpansionForActive(prev, entry.path, onlyOneExpandedTree, index)
      return next
    })
  }, [index, onlyOneExpandedTree, setActiveId])

  const expand = useCallback((id: string) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      const activePath = resolvedActiveId != null
        ? index.byId.get(resolvedActiveId)?.path ?? null
        : null
      return pruneExpandedIds(next, activePath, onlyOneExpandedTree, index)
    })
  }, [index, onlyOneExpandedTree, resolvedActiveId])

  const collapse = useCallback((id: string) => {
    if (resolvedActiveId != null) {
      const activeEntry = index.byId.get(resolvedActiveId)
      if (activeEntry != null && isAncestorOf(id, activeEntry.path)) return
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
  }, [index, resolvedActiveId])

  const toggleExpansion = useCallback((id: string) => {
    const entry = index.byId.get(id)
    if (entry == null || entry.node.items.length === 0) return

    const isExpanded = expandedIds.has(id)
    if (isExpanded) {
      collapse(id)
    } else {
      expand(id)
    }
  }, [index, expandedIds, expand, collapse])

  const next = useCallback(() => {
    if (items.length === 0) return

    if (resolvedActiveId == null) {
      navigateTo(items[0].id)
      return
    }

    const currentIndex = items.findIndex((item) => item.id === resolvedActiveId)
    const startIndex = currentIndex < 0 ? 0 : currentIndex

    if (startIndex < items.length - 1) {
      navigateTo(items[startIndex + 1].id)
      return
    }
  }, [items, resolvedActiveId, navigateTo])

  const previous = useCallback(() => {
    if (items.length === 0) return

    if (resolvedActiveId == null) {
      navigateTo(items[items.length - 1].id)
      return
    }

    const currentIndex = items.findIndex((item) => item.id === resolvedActiveId)
    const startIndex = currentIndex < 0 ? items.length - 1 : currentIndex

    if (startIndex > 0) {
      navigateTo(items[startIndex - 1].id)
      return
    }
  }, [items, resolvedActiveId, navigateTo])

  const first = useCallback(() => {
    if (items.length === 0) return
    navigateTo(items[0].id)
  }, [items, navigateTo])

  const last = useCallback(() => {
    if (items.length === 0) return
    navigateTo(items[items.length - 1].id)
  }, [items, navigateTo])

  return useMemo((): TreeNavigationReturn => ({
    items,
    activeItem,
    navigateTo,
    expand,
    collapse,
    next,
    previous,
    first,
    last,
    toggleExpansion,
  }), [items, activeItem, navigateTo, expand, collapse, next, previous, first, last, toggleExpansion])
}
