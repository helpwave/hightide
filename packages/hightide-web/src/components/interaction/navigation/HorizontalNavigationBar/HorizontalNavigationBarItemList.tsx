import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import type { NavigationItemData } from '../types'
import { isNavigationGroupItem } from '../types'
import { HorizontalNavigationBarLink } from './HorizontalNavigationBarLink'
import { HorizontalNavigationBarSubItem } from './HorizontalNavigationBarSubItem'

export type HorizontalNavigationBarItemListProps = HTMLAttributes<HTMLUListElement> & {
  items: NavigationItemData[],
}

export const HorizontalNavigationBarItemList = forwardRef<HTMLUListElement, HorizontalNavigationBarItemListProps>(
  function HorizontalNavigationBarItemList({ items, className, ...props }, forwardedRef) {
    return (
      <ul
        {...props}
        ref={forwardedRef}
        className={clsx('horizontal-navigation-bar-item-list', className)}
      >
        {items.map((item) => (
          isNavigationGroupItem(item) ? (
            <HorizontalNavigationBarSubItem key={item.id} {...item} />
          ) : (
            <HorizontalNavigationBarLink key={item.id} {...item} />
          )
        ))}
      </ul>
    )
  }
)
