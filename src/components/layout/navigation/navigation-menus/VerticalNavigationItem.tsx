import type { KeyboardEvent, MouseEvent } from 'react'
import { useCallback, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { useNavigationItem } from './NavigationContext'
import type { NavigationItemData } from './types'

export interface VerticalNavigationItemProps {
  id: string,
  label: NavigationItemData['label'],
  url?: string,
  external?: boolean,
  items?: NavigationItemData[],
  depth?: number,
}

export function VerticalNavigationItem({
  id,
  label,
  url,
  external = false,
  items,
  depth = 0,
}: VerticalNavigationItemProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const {
    expanded,
    isFocused,
    path,
    ref,
    navigateTo,
    expand,
    collapse,
    next,
    previous,
    first,
    last,
    toggleExpansion,
  } = useNavigationItem(id)

  const hasChildren = items != null && items.length > 0
  const firstChildId = hasChildren ? items[0]?.id : undefined

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLLIElement>) => {
    if (!isFocused || event.target !== event.currentTarget) return

    if (event.key === 'ArrowRight') {
      if (!hasChildren) return
      if (!expanded) {
        expand(id)
        return
      }
      if (firstChildId != null) {
        navigateTo(firstChildId)
      }
      return
    }

    if (event.key === 'ArrowLeft') {
      if (hasChildren && expanded) {
        collapse(id)
        return
      }
      const parentId = path.length > 1 ? path[path.length - 2] : null
      if (parentId != null) {
        navigateTo(parentId)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      next()
      return
    }

    if (event.key === 'ArrowUp') {
      previous()
      return
    }

    if (event.key === 'Home') {
      first()
      return
    }

    if (event.key === 'End') {
      last()
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (hasChildren) {
        toggleExpansion(id, { isFocusing: true })
      } else {
        navigateTo(id)
      }
      if (url == null) return
      if (external) {
        window.open(url, '_blank', 'noopener,noreferrer')
        return
      }
      window.location.assign(url)
    }
  }, [collapse, expand, expanded, external, first, firstChildId, hasChildren, id, isFocused, last, navigateTo, next, path, previous, toggleExpansion, url])

  const handleHeaderActivate = useCallback(() => {
    toggleExpansion(id, { isFocusing: true })
  }, [id, toggleExpansion])

  const handleLeafActivate = useCallback((event: MouseEvent<HTMLLIElement>) => {
    if ((event.target as Element).closest('[data-name="vertical-navigation-item-link"]')) return
    navigateTo(id)
  }, [id, navigateTo])

  const labelContent = url == null ? (
    label
  ) : external ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-name="vertical-navigation-item-link"
      tabIndex={-1}
    >
      {label}
      <ExternalLink className="size-force-5" />
    </a>
  ) : (
    <a
      href={url}
      data-name="vertical-navigation-item-link"
      tabIndex={-1}
    >
      {label}
    </a>
  )

  if (!hasChildren) {
    return (
      <li
        ref={ref}
        role="treeitem"
        data-name="vertical-navigation-item"
        data-depth={depth}
        data-active={isFocused ? '' : undefined}
        aria-selected={isFocused ? true : undefined}
        tabIndex={isFocused ? 0 : -1}
        onKeyDown={handleKeyDown}
        onClick={handleLeafActivate}
      >
        {labelContent}
      </li>
    )
  }

  return (
    <li
      ref={ref}
      role="treeitem"
      data-name="vertical-navigation-node"
      data-depth={depth}
      data-active={isFocused ? '' : undefined}
      data-expanded={expanded ? '' : undefined}
      aria-expanded={expanded}
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={handleKeyDown}
      className="group/tree-node"
    >
      <div
        ref={headerRef}
        data-name="vertical-navigation-node-header"
        data-active={isFocused ? '' : undefined}
        onClick={handleHeaderActivate}
      >
        {label}
        <ExpansionIcon isExpanded={expanded} aria-hidden />
      </div>
      {expanded && (
        <ul
          role="group"
          data-name="vertical-navigation-group"
        >
          {items.map((item) => (
            <VerticalNavigationItem key={item.id} {...item} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
