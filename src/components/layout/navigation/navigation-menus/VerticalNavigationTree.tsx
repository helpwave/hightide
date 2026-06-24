import {
  NavigationProvider,
  type NavigationProviderProps
} from './NavigationContext'
import { VerticalNavigationItem } from './VerticalNavigationItem'
import { type NavigationItemData, toTreeNodes } from './types'

export type { NavigationItemData } from './types'
export { VerticalNavigationItem } from './VerticalNavigationItem'
export {
  useNavigationContext as useVerticalNavigationContext,
  useNavigationItem as useVerticalNavigationItem,
  NavigationProvider as VerticalNavigationProvider,
} from './NavigationContext'

export interface VerticalNavigationTreeProps extends Omit<NavigationProviderProps, 'children' | 'nodes'> {
  items: NavigationItemData[],
}

export function VerticalNavigationTree({
  items,
  ...navigationOptions
}: VerticalNavigationTreeProps) {
  const nodes = toTreeNodes(items)

  return (
    <NavigationProvider nodes={nodes} {...navigationOptions}>
      <ul role="tree" data-name="vertical-navigation-tree">
        {items.map((item) => (
          <VerticalNavigationItem key={item.id} {...item} />
        ))}
      </ul>
    </NavigationProvider>
  )
}
