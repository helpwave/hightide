import type { TreeIndex, TreeIndexEntry, TreeItem, TreeNode } from './types'


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

function areExpandedIdsEqual(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>
): boolean {
  if (left === right) return true
  if (left.size !== right.size) return false
  for (const id of left) {
    if (!right.has(id)) return false
  }
  return true
}

function syncExpansionForFocused(
  expandedIds: ReadonlySet<string>,
  focusedPath: ReadonlyArray<string>,
  onlyOneExpandedTree: boolean,
  index: TreeIndex
): ReadonlySet<string> {
  const next = new Set(expandedIds)

  for (const id of getExpandableAncestorIds(focusedPath, index)) {
    next.add(id)
  }

  const pruned = pruneExpandedIds(next, focusedPath, onlyOneExpandedTree, index)
  return areExpandedIdsEqual(expandedIds, pruned) ? expandedIds : pruned
}

export const TreeUtilities = {
  areExpandedIdsEqual,
  syncExpansionForFocused,
  buildTreeIndex,
  flattenAllItems,
  flattenVisibleItems,
  getDescendantIds,
  getExpandableAncestorIds,
  isAncestorOf,
  pruneExpandedIds
}