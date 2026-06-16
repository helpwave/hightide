import {
  VerticalNavigationProvider,
  type VerticalNavigationProviderProps
} from './VerticalNavigationContext'
import { VerticalNavigationItem } from './VerticalNavigationItem'
import { type NavigationItemData, toTreeNodes } from './types'

export interface VerticalNavigationTreeProps extends Omit<VerticalNavigationProviderProps, 'children' | 'nodes'> {
  items: NavigationItemData[],
}

export function VerticalNavigationTree({
  items,
  ...navigationOptions
}: VerticalNavigationTreeProps) {
  const nodes = toTreeNodes(items)

  return (
    <VerticalNavigationProvider nodes={nodes} {...navigationOptions}>
      <ul role="tree" data-name="vertical-navigation-tree">
        {items.map((item) => (
          <VerticalNavigationItem key={item.id} {...item} />
        ))}
      </ul>
    </VerticalNavigationProvider>
  )
}
