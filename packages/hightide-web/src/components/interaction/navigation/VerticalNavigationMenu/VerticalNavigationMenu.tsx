import type { ElementType } from 'react'
import { type NavigationItemData, toTreeNodes } from '../types'
import {
  VerticalNavigationMenuContext,
  VerticalNavigationMenuProvider,
  type VerticalNavigationMenuProviderProps
} from './VerticalNavigationMenuContext'
import { VerticalNavigationMenuItem, type LinkComponentProps } from './VerticalNavigationMenuItem'

export type { LinkComponentProps } from './VerticalNavigationMenuItem'

export type VerticalNavigationMenuProps = Omit<VerticalNavigationMenuProviderProps, 'children' | 'nodes'> & {
  items: NavigationItemData[],
  LinkComponent?: ElementType<LinkComponentProps>,
}

function VerticalNavigationMenuRoot({
  items,
  LinkComponent,
  ...navigationOptions
}: VerticalNavigationMenuProps) {
  const nodes = toTreeNodes(items)

  return (
    <VerticalNavigationMenuProvider nodes={nodes} {...navigationOptions}>
      <ul className="vertical-navigation-menu">
        {items.map((item) => (
          <VerticalNavigationMenuItem key={item.id} {...item} LinkComponent={LinkComponent} />
        ))}
      </ul>
    </VerticalNavigationMenuProvider>
  )
}

export const VerticalNavigationMenu = Object.assign(VerticalNavigationMenuRoot, {
  Item: VerticalNavigationMenuItem,
  Context: VerticalNavigationMenuContext,
  Provider: VerticalNavigationMenuProvider,
  Consumer: VerticalNavigationMenuContext.Consumer,
})
