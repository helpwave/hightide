import clsx from 'clsx'
import type { ListNavigationItemProps } from '../../layout/list/ListNavigationItem'
import { ListNavigationItem } from '../../layout/list/ListNavigationItem'

export type MenuNavigationItemProps = ListNavigationItemProps

export function MenuNavigationItem({
  className,
  ...props
}: MenuNavigationItemProps) {
  return (
    <ListNavigationItem
      {...props}
      className={clsx('menu-navigation-item', className)}
    />
  )
}
