import type { ListNavigationItemProps } from '../../layout/list/ListNavigationItem'
import { ListNavigationItem } from '../../layout/list/ListNavigationItem'

export type MenuNavigationItemProps = ListNavigationItemProps

export function MenuNavigationItem(props: MenuNavigationItemProps) {
  return (
    <ListNavigationItem {...props} />
  )
}
