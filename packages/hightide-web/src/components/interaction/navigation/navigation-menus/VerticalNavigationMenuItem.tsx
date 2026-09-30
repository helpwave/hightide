import type { ElementType, HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { useId } from 'react'
import { ExternalLink } from 'lucide-react'
import { Icon } from '../../../visualization/Icon'
import { ExpansionIcon } from '../../../visualization/ExpansionIcon'
import { useNavigationItem } from './NavigationContext'
import type { NavigationItemData } from './types'

export interface LinkComponentProps {
  'className'?: string,
  'href': string,
  'target'?: HTMLAttributeAnchorTarget | undefined,
  'rel'?: string | undefined,
  'aria-current'?: 'page' | undefined,
  'children'?: ReactNode,
}

export type VerticalNavigationMenuItemProps = NavigationItemData & {
  depth?: number,
  forceMountDepth?: number,
  LinkComponent?: ElementType<LinkComponentProps>,
}

const DefaultLink: ElementType<LinkComponentProps> = 'a'

export function VerticalNavigationMenuItem({
  id,
  label,
  depth = 0,
  forceMountDepth = 2,
  LinkComponent = DefaultLink,
  ...item
}: VerticalNavigationMenuItemProps) {
  const groupId = useId()
  const {
    expanded,
    isActive,
    toggleExpansion,
  } = useNavigationItem(id)

  const childItems = 'items' in item && item.items != null ? item.items : undefined
  const url = 'url' in item ? item.url : undefined
  const external = 'external' in item ? item.external ?? false : false
  const hasChildren = childItems != null && childItems.length > 0

  const labelContent = url != null ? (
    <LinkComponent
      href={url}
      className="vertical-navigation-item-link"
      aria-current={isActive ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <div className="vertical-navigation-item-label">
        {label}
        {external && (
          <Icon icon={ExternalLink} size="sm" className="vertical-navigation-item-link-external-icon" />
        )}
      </div>
    </LinkComponent>
  ) : (
    <div className="vertical-navigation-item-label">
      {label}
    </div>
  )

  const interactable = url != null || hasChildren
  const forceMountChildren = depth < forceMountDepth

  return (
    <li
      data-depth={depth}
      data-expanded={expanded ? '' : undefined}
      className="vertical-navigation-item"
    >
      {hasChildren ? (
        <button
          type="button"
          className="vertical-navigation-item-row-container"
          data-has-children=""
          aria-expanded={expanded}
          aria-controls={groupId}
          onClick={() => {
            toggleExpansion(id)
          }}
        >
          <div className="vertical-navigation-item-row">
            {labelContent}
          </div>
          <ExpansionIcon isExpanded={expanded} aria-hidden className="vertical-navigation-toggle" />
        </button>
      ) : (
        <div className="vertical-navigation-item-row-container">
          <div
            className="vertical-navigation-item-row"
            data-interactable={interactable ? '' : undefined}
          >
            {labelContent}
          </div>
        </div>
      )}

      {childItems != null && childItems.length > 0 && (expanded || forceMountChildren) && (
        <ul
          id={groupId}
          className="vertical-navigation-group"
          hidden={!expanded}
        >
          {childItems.map((child) => (
            <VerticalNavigationMenuItem
              key={child.id}
              {...child}
              depth={depth + 1}
              LinkComponent={LinkComponent}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
