import type { ReactNode } from 'react'
import { VerticalNavigationTree, type VerticalNavigationTreeProps } from './VerticalNavigationTree'

export type { NavigationItemData } from './types'
export type { VerticalNavigationTreeProps } from './VerticalNavigationTree'
export { VerticalNavigationItem } from './VerticalNavigationItem'
export { VerticalNavigationTree } from './VerticalNavigationTree'
export {
  useVerticalNavigationContext,
  useVerticalNavigationItem,
  VerticalNavigationProvider,
} from './VerticalNavigationContext'

export interface VerticalNavigationProps extends VerticalNavigationTreeProps {
  header: ReactNode,
  footer: ReactNode,
}

export function VerticalNavigation({
  header,
  footer,
  items,
  ...navigationOptions
}: VerticalNavigationProps) {
  return (
    <div data-name="vertical-navigation-menu">
      {header}
      <VerticalNavigationTree items={items} {...navigationOptions} />
      {footer}
    </div>
  )
}
