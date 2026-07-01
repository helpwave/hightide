import type { ElementType, HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from 'react'
import { useId, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useNavigationItem } from './NavigationContext'
import type { NavigationItemData } from './types'

export interface LinkComponentProps {
  'className'?: string,
  'href': string,
  'target'?: HTMLAttributeAnchorTarget | undefined,
  'rel'?: string | undefined,
  'aria-current'?: 'page' | undefined,
  'children'?: ReactNode,
  'onClick'?: (event: MouseEvent<HTMLAnchorElement>) => void,
}

export interface VerticalNavigationMenuItemProps {
  id: string,
  label: NavigationItemData['label'],
  url?: string,
  external?: boolean,
  items?: NavigationItemData[],
  depth?: number,
  forceMountDepth?: number,
  LinkComponent?: ElementType<LinkComponentProps>,
}

const DefaultLink: ElementType<LinkComponentProps> = 'a'

export function VerticalNavigationMenuItem({
  id,
  label,
  url,
  external = false,
  items,
  depth = 0,
  forceMountDepth = 2,
  LinkComponent = DefaultLink,
}: VerticalNavigationMenuItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const groupId = useId()
  const {
    expanded,
    isActive,
    toggleExpansion,
  } = useNavigationItem(id)

  const hasChildren = items != null && items.length > 0
  const hasLink = url != null

  const labelContent = hasLink ? (
    <LinkComponent
      href={url}
      className="vertical-navigation-item-link"
      aria-current={isActive ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {label}
      {external && (
        <ExternalLink className="vertical-navigation-item-link-external-icon" />
      )}
    </LinkComponent>
  ) : (
    <div className="vertical-navigation-item-label">
      {label}
    </div>
  )

  const interactable = hasLink || hasChildren
  const forceMountChildren = depth < forceMountDepth

  return (
    <li
      data-depth={depth}
      data-expanded={expanded ? '' : undefined}
      className="vertical-navigation-item"
    >
      <div
        className="vertical-navigation-item-row"
        data-interactable={interactable ? '' : undefined}
        onClick={(event) => {
          if(ref.current?.contains(event.target as Node)) return
          if(hasChildren && !hasLink) {
            toggleExpansion(id)
          }
        }}
      >
        {labelContent}

        {hasChildren && (
          <IconButton
            ref={ref}
            type="button"
            coloringStyle="text"
            color="neutral"
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${typeof label === 'string' ? label : id}`}
            aria-expanded={expanded}
            aria-controls={groupId}
            onClick={() => {
              toggleExpansion(id)
            }}
            className="vertical-navigation-toggle"
          >
            <ExpansionIcon isExpanded={expanded} aria-hidden />
          </IconButton>
        )}
      </div>

      {hasChildren && (expanded || forceMountChildren) && (
        <ul
          id={groupId}
          className="vertical-navigation-group"
          hidden={!expanded}
        >
          {items.map((item) => (
            <VerticalNavigationMenuItem
              key={item.id}
              {...item}
              depth={depth + 1}
              LinkComponent={LinkComponent}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
