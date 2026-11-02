import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import type { NavigationItemData, NavigationLinkComponentProps } from '../types'
import { HorizontalNavigationBarBar } from './HorizontalNavigationBarBar'
import { HorizontalNavigationBarContext } from './HorizontalNavigationBarContext'
import { HorizontalNavigationBarItemList } from './HorizontalNavigationBarItemList'
import { HorizontalNavigationBarLink } from './HorizontalNavigationBarLink'
import { HorizontalNavigationBarStateManager } from './HorizontalNavigationBarStateManager'
import { HorizontalNavigationBarSubItem } from './HorizontalNavigationBarSubItem'

export type HorizontalNavigationBarProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  items: NavigationItemData[],
  LinkComponent?: ElementType<NavigationLinkComponentProps>,
  onClose?: () => void,
  activeId?: string | null,
  children?: ReactNode,
}

function HorizontalNavigationBarComponent({
  items,
  LinkComponent,
  onClose,
  activeId,
  children,
  className,
  ...props
}: HorizontalNavigationBarProps) {
  return (
    <HorizontalNavigationBarStateManager
      LinkComponent={LinkComponent}
      onClose={onClose}
      activeId={activeId}
    >
      {children ?? (
        <nav {...props} className={clsx('min-w-0', className)}>
          <HorizontalNavigationBarBar>
            <HorizontalNavigationBarItemList items={items} />
          </HorizontalNavigationBarBar>
        </nav>
      )}
    </HorizontalNavigationBarStateManager>
  )
}

export const HorizontalNavigationBar = Object.assign(HorizontalNavigationBarComponent, {
  StateManager: HorizontalNavigationBarStateManager,
  Bar: HorizontalNavigationBarBar,
  ItemList: HorizontalNavigationBarItemList,
  Link: HorizontalNavigationBarLink,
  SubItem: HorizontalNavigationBarSubItem,
  Context: HorizontalNavigationBarContext,
  Provider: HorizontalNavigationBarContext.Provider,
  Consumer: HorizontalNavigationBarContext.Consumer,
})
