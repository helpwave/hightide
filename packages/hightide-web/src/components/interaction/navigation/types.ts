import type { HTMLAttributeAnchorTarget, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react'
import type { TreeNode } from '@helpwave/hightide-utils/hooks'

type NavigationItemBase = {
  id: string,
  label: ReactNode,
  icon?: ReactNode,
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

export type NavigationLinkComponentProps = {
  'className'?: string,
  'href': string,
  'target'?: HTMLAttributeAnchorTarget,
  'rel'?: string,
  'aria-current'?: 'page',
  'children'?: ReactNode,
  'onClick'?: MouseEventHandler<HTMLAnchorElement>,
  'onKeyDown'?: KeyboardEventHandler<HTMLAnchorElement>,
}

export function isNavigationGroupItem(item: NavigationItemData): item is NavigationGroupItem {
  return 'items' in item && item.items != null
}

export function isNavigationLinkItem(item: NavigationItemData): item is NavigationLinkItem {
  return 'url' in item && item.url != null
}

export function toTreeNodes(items: ReadonlyArray<NavigationItemData>): TreeNode[] {
  return items.map((item) => ({
    id: item.id,
    items: isNavigationGroupItem(item) ? toTreeNodes(item.items) : [],
  }))
}

export function findActiveIdByUrl(
  items: ReadonlyArray<NavigationItemData>,
  activeUrl: string
): string | null {
  for (const item of items) {
    if (isNavigationLinkItem(item) && item.url === activeUrl) {
      return item.id
    }
    if (isNavigationGroupItem(item)) {
      const found = findActiveIdByUrl(item.items, activeUrl)
      if (found != null) {
        return found
      }
    }
  }
  return null
}
