import type { KeyboardEvent, MouseEvent } from 'react'
import { useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { useVerticalNavigationItem } from './VerticalNavigationContext'
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
  } = useVerticalNavigationItem(id)

  const hasChildren = items != null && items.length > 0
  const firstChildId = hasChildren ? items[0]?.id : undefined

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLLIElement>) => {
    if (!isFocused || event.isDefaultPrevented()) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
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
      event.preventDefault()
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
      event.preventDefault()
      next()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      previous()
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      first()
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      last()
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigateTo(id)
      if (hasChildren) {
        toggleExpansion(id)
      }
      if (url == null) return
      if (external) {
        window.open(url, '_blank', 'noopener,noreferrer')
        return
      }
    }
  }, [collapse, expand, expanded, external, first, firstChildId, hasChildren, id, isFocused, last, navigateTo, next, path, previous, toggleExpansion, url])

  const handleActivate = useCallback((event: MouseEvent<HTMLLIElement>) => {
    if (event.isDefaultPrevented()) return
    event.preventDefault()
    if (hasChildren) {
      navigateTo(id)
      toggleExpansion(id)
      return
    }
    navigateTo(id)
    if (url == null) return
    if (event.target instanceof HTMLAnchorElement) return
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    window.location.assign(url)
  }, [external, hasChildren, id, navigateTo, toggleExpansion, url])

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
      <ExternalLink className="size-4" />
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
        onClick={handleActivate}
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
      onClick={handleActivate}
      className="group/tree-node"
    >
      <div data-name="vertical-navigation-node-header" data-active={isFocused ? '' : undefined}>
        <ExpansionIcon isExpanded={expanded} aria-hidden />
        {label}
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
