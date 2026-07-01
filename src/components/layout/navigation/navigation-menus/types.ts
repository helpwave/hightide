import type { ReactNode } from 'react'
import type { TreeNode } from '@/src/hooks/trees/types'

export interface NavigationItemData {
  id: string,
  label: ReactNode,
  url?: string,
  external?: boolean,
  items?: NavigationItemData[],
}

export function toTreeNodes(items: ReadonlyArray<NavigationItemData>): TreeNode[] {
  return items.map((item) => ({
    id: item.id,
    items: item.items != null ? toTreeNodes(item.items) : [],
  }))
}
