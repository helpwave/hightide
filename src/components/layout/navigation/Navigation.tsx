import { Menu as MenuIcon, XIcon } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import React, { useCallback, useId, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import type { UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import { useAnchoredPosition } from '@/src/hooks/useAnchoredPosition'
import { Button } from '@/src/components/user-interaction/Button'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

type SimpleNavigationItem = {
  label: ReactNode,
  link: string,
  external?: boolean,
}

// TODO allow for nesting deeper than one level
type SubItemNavigationItem = {
  label: ReactNode,
  items?: SimpleNavigationItem[],
}

export type NavigationItemType = SimpleNavigationItem | SubItemNavigationItem

function isSubItem(item: NavigationItemType): item is SubItemNavigationItem {
  return 'items' in item && Array.isArray(item.items)
}

///
/// NavigationItemWithSubItem
///
type NavigationItemWithSubItemProps = SubItemNavigationItem & UseAnchoredPositionOptions

const NavigationItemWithSubItem = ({
  items,
  label,
  horizontalAlignment = 'center',
  ...options
}: NavigationItemWithSubItemProps) => {
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()

  const style = useAnchoredPosition({
    active: isOpen,
    containerRef,
    anchorRef: triggerRef,
    horizontalAlignment,
    ...options,
  })

  const onBlur = useCallback((event: React.FocusEvent) => {
    // If focus moves outside the menu + trigger, close
    const nextFocus = event.relatedTarget as Node | null
    if (
      !containerRef.current?.contains(nextFocus) &&
      !triggerRef.current?.contains(nextFocus)
    ) {
      setOpen(false)
    }
  }, [])

  const { zIndex } = useOverlayRegistry()
  // TODO at arrow key navigation

  return (
    <>
      <button
        id={'navigation-' + id}
        ref={triggerRef}
        type="button"

        onClick={() => {
          setOpen(!isOpen)
        }}
        onBlur={onBlur}

        className="link flex-row-1"

        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={'navigation-items-' + id}
      >
        {label}
        <ExpansionIcon isExpanded={isOpen} />
      </button>
      <ul
        id={'navigation-items-' + id}
        ref={containerRef}

        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        onBlur={onBlur}

        hidden={!isOpen}
        className={clsx(
          'fixed flex-col-4 p-4 bg-surface text-on-surface shadow-side shadow-hw-bottom rounded-md',
          { 'opacity-0': !style }
        )}
        style={{ ...style, zIndex }}
      >
        {items.map(({ link, label, external }, index) => (
          <li key={index}>
            <Link
              href={link}
              target={external ? '_blank' : undefined}
              className="flex-row-0 link w-full"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

///
/// NavigationItemList
///
export type NavigationItemListProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  items: NavigationItemType[],
}

export const NavigationItemList = ({ items, ...restProps }: NavigationItemListProps) => {
  return (
    <ul {...restProps} className={clsx('flex-row-6 items-center', restProps.className)}>
      {items.map((item, index) => (
        <li key={index}>
          {isSubItem(item) ? (
            <NavigationItemWithSubItem {...item} />
          ) : (
            <Link href={item.link} target={item.external ? '_blank' : undefined} className="link">{item.label}</Link>
          )}
        </li>
      ))}
    </ul>
  )
}

///
/// Navigation
///
export type NavigationProps = NavigationItemListProps

export const Navigation = ({ ...props }: NavigationProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const id = useId()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    menuRef.current?.focus()
  }, [isMobileOpen])

  const { zIndex } = useOverlayRegistry({ isActive: isMobileOpen })

  return (
    <nav>
      <NavigationItemList
        {...props}
        className={clsx('hidden', { 'desktop:flex': !isMobileOpen }, props.className)}
      />
      <Button
        layout="icon"
        coloringStyle="text"
        color="neutral"
        onClick={() => setIsMobileOpen(true)}

        className="desktop:hidden"

        aria-haspopup="true"
        aria-expanded={isMobileOpen}
        aria-controls={'navigation-menu-' + id}
      >
        <MenuIcon className="w-6 h-6"/>
      </Button>
      <div
        id={'navigation-menu-' + id}
        ref={menuRef}
        hidden={!isMobileOpen}

        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsMobileOpen(false)
            event.preventDefault()
            event.stopPropagation()
          }
        }}

        className={clsx(
          'flex-col-8 items-center justify-center fixed inset-0 p-8 w-screen h-screen bg-surface text-on-surface', {
            'desktop:hidden': isMobileOpen,
          },
          props.className
        )}
        style={{ zIndex }}
      >
        <Button
          layout="icon"
          coloringStyle="text"
          color="neutral"
          onClick={() => setIsMobileOpen(false)}
        >
          <XIcon/>
        </Button>
        <NavigationItemList {...props} className={clsx('flex-col-8', props.className)}/>
      </div>
    </nav>
  )
}