import type { ElementType, ReactNode } from 'react'
import { useMemo } from 'react'
import type { NavigationLinkComponentProps } from '../types'
import {
  HorizontalNavigationBarContext,
  type HorizontalNavigationBarContextValue
} from './HorizontalNavigationBarContext'

const DefaultLink: ElementType<NavigationLinkComponentProps> = 'a'

export type HorizontalNavigationBarStateManagerProps = {
  children?: ReactNode,
  LinkComponent?: ElementType<NavigationLinkComponentProps>,
  onClose?: () => void,
  activeId?: string | null,
}

export function HorizontalNavigationBarStateManager({
  children,
  LinkComponent = DefaultLink,
  onClose,
  activeId = null,
}: HorizontalNavigationBarStateManagerProps) {
  const contextValue = useMemo((): HorizontalNavigationBarContextValue => ({
    LinkComponent,
    onClose,
    activeId,
  }), [LinkComponent, onClose, activeId])

  return (
    <HorizontalNavigationBarContext.Provider value={contextValue}>
      {children}
    </HorizontalNavigationBarContext.Provider>
  )
}
