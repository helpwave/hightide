import type { KeyboardEvent, MouseEvent } from 'react'
import { useCallback, useRef } from 'react'
import Link from 'next/link'
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

/**
 * Absolute web URLs (and protocol-relative ones) always point at a different
 * origin, so they can never be handled by the client-side router and should open
 * in a new tab by default. Consumers can still force this via the `external` prop.
 */
function isExternalUrl(url?: string): boolean {
  if (url == null) return false
  return /^(https?:)?\/\//i.test(url)
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
  const linkRef = useRef<HTMLAnchorElement>(null)
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
  const isExternal = external || isExternalUrl(url)

  // Navigation is delegated to the underlying `next/link` anchor. Synthesizing a
  // click on it routes through the host app's router exactly like a real click
  // does — client-side, history-aware (so the browser back button works), and it
  // honours `target="_blank"` for external links. Keeping a single navigation path
  // (rather than a parallel `router.push`) means it stays router-agnostic and
  // works in both the Pages and App router.
  const activateLink = useCallback(() => {
    linkRef.current?.click()
  }, [])

  const handleLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    // Let `next/link` perform the navigation itself; we only sync the tree's
    // focus state and stop the row handler from firing a second time.
    event.stopPropagation()
    navigateTo(id)
  }, [id, navigateTo])

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
        return
      }
      navigateTo(id)
      if (url == null) return
      event.preventDefault()
      activateLink()
    }
  }, [activateLink, collapse, expand, expanded, first, firstChildId, hasChildren, id, isFocused, last, navigateTo, next, path, previous, toggleExpansion, url])

  const handleHeaderActivate = useCallback(() => {
    toggleExpansion(id, { isFocusing: true })
  }, [id, toggleExpansion])

  const handleLeafActivate = useCallback((event: MouseEvent<HTMLLIElement>) => {
    if ((event.target as Element).closest('[data-name="vertical-navigation-item-link"]')) return
    navigateTo(id)
    activateLink()
  }, [activateLink, id, navigateTo])

  const labelContent = url == null ? (
    label
  ) : (
    <Link
      ref={linkRef}
      href={url}
      data-name="vertical-navigation-item-link"
      tabIndex={-1}
      draggable={false}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={handleLinkClick}
    >
      {label}
      {isExternal && (
        <ExternalLink className="vertical-navigation-item-link-external-icon" />
      )}
    </Link>
  )

  if (!hasChildren) {
    return (
      <li
        ref={ref}
        role="treeitem"
        data-name="vertical-navigation-item"
        data-depth={depth}
        data-focused={isFocused ? '' : undefined}
        aria-selected={isFocused ? true : undefined}
        tabIndex={isFocused ? 0 : -1}
        onKeyDown={handleKeyDown}
        onClick={handleLeafActivate}
        className="group/tree-leaf"
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
      data-focused={isFocused ? '' : undefined}
      data-expanded={expanded ? '' : undefined}
      aria-expanded={expanded}
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={handleKeyDown}
      className="group/tree-node"
    >
      <div
        ref={headerRef}
        data-name="vertical-navigation-node-header"
        data-focused={isFocused ? '' : undefined}
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
