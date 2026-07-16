import type { ElementType } from 'react'
import {
  NavigationProvider,
  type NavigationProviderProps
} from './NavigationContext'
import { VerticalNavigationMenuItem, type LinkComponentProps } from './VerticalNavigationMenuItem'
import { type NavigationItemData, toTreeNodes } from './types'

export type { NavigationItemData } from './types'
export type { LinkComponentProps } from './VerticalNavigationMenuItem'
export { VerticalNavigationMenuItem as VerticalNavigationItem } from './VerticalNavigationMenuItem'
export {
  useNavigationContext as useVerticalNavigationContext,
  useNavigationItem as useVerticalNavigationItem,
  NavigationProvider as VerticalNavigationProvider,
} from './NavigationContext'

export interface VerticalNavigationMenuProps extends Omit<NavigationProviderProps, 'children' | 'nodes'> {
  items: NavigationItemData[],
  LinkComponent?: ElementType<LinkComponentProps>,
}

export function VerticalNavigationMenu({
  items,
  LinkComponent,
  ...navigationOptions
}: VerticalNavigationMenuProps) {
  const nodes = toTreeNodes(items)

  return (
    <NavigationProvider nodes={nodes} {...navigationOptions}>
      <ul data-name="vertical-navigation-menu">
        {items.map((item) => (
          <VerticalNavigationMenuItem key={item.id} {...item} LinkComponent={LinkComponent} />
        ))}
      </ul>
    </NavigationProvider>
  )
}
