import type { ElementType, HTMLAttributes } from 'react'
import { useRef } from 'react'
import clsx from 'clsx'
import { useOverlayRegistry } from '@helpwave/hightide-utils/hooks'
import { FocusTrap } from '../../FocusTrap'
import { VerticalNavigationMenu } from '../VerticalNavigationMenu'
import type { NavigationItemData, NavigationLinkComponentProps } from '../types'
import { FullScreenVerticalNavigationCloseButton } from './FullScreenVerticalNavigationCloseButton'
import { useFullScreenVerticalNavigationContext } from './FullScreenVerticalNavigationContext'

export type FullScreenVerticalNavigationPanelProps = HTMLAttributes<HTMLDivElement> & {
  items?: NavigationItemData[],
  LinkComponent?: ElementType<NavigationLinkComponentProps>,
  activeId?: string | null,
}

export function FullScreenVerticalNavigationPanel({
  items: itemsProp,
  LinkComponent: LinkComponentProp,
  activeId: activeIdProp,
  className,
  ...props
}: FullScreenVerticalNavigationPanelProps) {
  const { state, dispatch, items, LinkComponent, activeId } = useFullScreenVerticalNavigationContext()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const resolvedItems = itemsProp ?? items
  const resolvedLinkComponent = LinkComponentProp ?? LinkComponent
  const resolvedActiveId = activeIdProp !== undefined ? activeIdProp : activeId
  const { zIndex } = useOverlayRegistry({ isActive: state.isOpen })

  return (
    <FocusTrap
      active={state.isOpen}
      container={panelRef}
      initialFocus={closeRef}
    >
      <div
        {...props}
        ref={panelRef}
        hidden={!state.isOpen}
        className={clsx('full-screen-vertical-navigation-panel', className)}
        style={{ ...props.style, zIndex }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event)
          if (event.key === 'Escape') {
            dispatch({ type: 'close' })
          }
        }}
      >
        <FullScreenVerticalNavigationCloseButton
          ref={closeRef}
          className="full-screen-vertical-navigation-close-button"
        />
        <VerticalNavigationMenu
          items={resolvedItems}
          LinkComponent={resolvedLinkComponent}
          activeId={resolvedActiveId}
        />
      </div>
    </FocusTrap>
  )
}
