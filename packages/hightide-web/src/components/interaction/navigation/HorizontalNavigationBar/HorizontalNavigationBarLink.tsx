import { ExternalLink } from 'lucide-react'
import { Icon } from '../../../visualization/Icon'
import type { NavigationLabelItem, NavigationLinkItem } from '../types'
import { isNavigationLinkItem } from '../types'
import { useHorizontalNavigationBarContext } from './HorizontalNavigationBarContext'

export type HorizontalNavigationBarLinkProps = NavigationLinkItem | NavigationLabelItem

export function HorizontalNavigationBarLink(item: HorizontalNavigationBarLinkProps) {
  const { LinkComponent, onClose, activeId } = useHorizontalNavigationBarContext()
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
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  onClose?.()
                }
              }}
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
