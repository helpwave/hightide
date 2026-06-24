import type { HTMLAttributes, ReactNode } from 'react'
import { VerticalNavigationTree } from './VerticalNavigationTree'
import type { TreeNavigationOptions } from '@/src/hooks/useTreeNavigation'
import type { NavigationItemData } from './types'

export type { NavigationItemData } from './types'
export type { VerticalNavigationTreeProps } from './VerticalNavigationTree'
export { VerticalNavigationItem } from './VerticalNavigationItem'
export { VerticalNavigationTree } from './VerticalNavigationTree'
export {
  useVerticalNavigationContext,
  useVerticalNavigationItem,
  VerticalNavigationProvider,
} from './VerticalNavigationContext'

export interface VerticalNavigationProps extends HTMLAttributes<HTMLDivElement>, Omit<TreeNavigationOptions, 'nodes'> {
  header: ReactNode,
  footer: ReactNode,
  items: NavigationItemData[],
}

export function VerticalNavigation({
  header,
  footer,
  items,
  activeId,
  onActiveIdChange,
  initialActiveId,
  onlyOneExpandedTree,
  ...props
}: VerticalNavigationProps) {
  return (
    <div data-name="vertical-navigation-menu" {...props}>
      {header}
      <VerticalNavigationTree
        items={items}
        activeId={activeId}
        onActiveIdChange={onActiveIdChange}
        initialActiveId={initialActiveId}
        onlyOneExpandedTree={onlyOneExpandedTree}
      />
      {footer}
    </div>
  )
}
