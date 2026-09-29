import type { ReactNode } from 'react'
import type { TreeNode } from '@helpwave/hightide-utils/hooks'

type NavigationItemBase = {
  id: string,
  label: ReactNode,
}

export type NavigationLinkItem = NavigationItemBase & {
  url: string,
  external?: boolean,
  items?: never,
}

export type NavigationGroupItem = NavigationItemBase & {
  items: NavigationItemData[],
  url?: never,
  external?: never,
}

export type NavigationLabelItem = NavigationItemBase & {
  url?: never,
  external?: never,
  items?: never,
}

export type NavigationItemData = NavigationLinkItem | NavigationGroupItem | NavigationLabelItem

export function toTreeNodes(items: ReadonlyArray<NavigationItemData>): TreeNode[] {
  return items.map((item) => ({
    id: item.id,
    items: 'items' in item && item.items != null ? toTreeNodes(item.items) : [],
  }))
}
