export interface TreeNode {
  id: string,
  items: TreeNode[],
}

export interface TreeItem {
  id: string,
  path: ReadonlyArray<string>,
  expanded: boolean,
}

export interface TreeIndexEntry {
  node: TreeNode,
  parentId: string | null,
  path: string[],
}

export interface TreeIndex {
  byId: Map<string, TreeIndexEntry>,
  roots: TreeNode[],
}