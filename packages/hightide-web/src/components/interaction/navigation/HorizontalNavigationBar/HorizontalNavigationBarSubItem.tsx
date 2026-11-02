import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useOverlayRegistry } from '@helpwave/hightide-utils/hooks'
import { Icon } from '../../../visualization/Icon'
import { ExpansionIcon } from '../../../visualization/ExpansionIcon'
import { Portal } from '../../../layout/Portal'
import { AnchoredFloatingContainer } from '../../../layout/AnchoredFloatingContainer'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'
import type { NavigationGroupItem, NavigationItemData } from '../types'
import { isNavigationLinkItem } from '../types'
import { useHorizontalNavigationBarContext } from './HorizontalNavigationBarContext'

export type HorizontalNavigationBarSubItemProps = NavigationGroupItem

function HorizontalNavigationBarDropdownRow({ item }: { item: NavigationItemData }) {
  const { LinkComponent, activeId } = useHorizontalNavigationBarContext()
  const isLink = isNavigationLinkItem(item)
  const isActive = activeId != null && item.id === activeId
  const interactable = isLink

  const labelContent = (
    <div className="vertical-navigation-item-label">
      {item.icon && (
        <span className="size-5">
          {item.icon}
        </span>
      )}
      {item.label}
      {isLink && item.external && (
        <Icon icon={ExternalLink} size="sm" className="vertical-navigation-item-link-external-icon" />
      )}
    </div>
  )

  return (
    <li
      data-active={isActive ? '' : undefined}
      className="vertical-navigation-item"
    >
      <div className="vertical-navigation-item-row-container">
        <div
          className="vertical-navigation-item-row"
          data-interactable={interactable ? '' : undefined}
        >
          {isLink ? (
            <LinkComponent
              href={item.url}
              className="vertical-navigation-item-link"
              aria-current={isActive ? 'page' : undefined}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {labelContent}
            </LinkComponent>
          ) : (
            labelContent
          )}
        </div>
      </div>
    </li>
  )
}

export function HorizontalNavigationBarSubItem({
  id,
  label,
  icon,
  items,
}: HorizontalNavigationBarSubItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const { activeId, onClose } = useHorizontalNavigationBarContext()
  const isActive = activeId != null && (
    id === activeId || items.some((child) => child.id === activeId)
  )
  const { zIndex } = useOverlayRegistry({ isActive: isOpen })
  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const outsideClickRefs = useMemo(() => [triggerRef, dropdownRef], [])

  useOutsideClick({
    active: isOpen,
    refs: outsideClickRefs,
    onOutsideClick: close,
  })

  return (
    <li
      data-active={isActive ? '' : undefined}
      className="vertical-navigation-item"
    >
      <button
        ref={triggerRef}
        type="button"
        className="vertical-navigation-item-row-container"
        data-has-children=""
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close()
          }
        }}
      >
        <div className="vertical-navigation-item-row">
          <div className="vertical-navigation-item-label">
            {icon && (
              <span className="size-5">
                {icon}
              </span>
            )}
            {label}
          </div>
        </div>
        <ExpansionIcon isExpanded={isOpen} aria-hidden className="vertical-navigation-toggle" />
      </button>
      {isOpen && (
        <Portal>
          <AnchoredFloatingContainer
            ref={dropdownRef}
            id={menuId}
            anchor={triggerRef}
            active={isOpen}
            role="menu"
            className="horizontal-navigation-bar-dropdown"
            style={{ zIndex, position: 'fixed' }}
            options={{
              horizontalAlignment: 'afterStart',
              verticalAlignment: 'afterEnd',
            }}
          >
            <ul className="horizontal-navigation-bar-dropdown-list">
              {items.map((child) => (
                <HorizontalNavigationBarDropdownRow key={child.id} item={child} />
              ))}
            </ul>
          </AnchoredFloatingContainer>
        </Portal>
      )}
    </li>
  )
}
