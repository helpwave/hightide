import { type PropsWithChildren, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { createPortal } from 'react-dom'
import type { PopoverHorizontalAlignment, PopoverVerticalAlignment } from '@/src/hooks/usePopoverPosition'
import { usePopoverPosition } from '@/src/hooks/usePopoverPosition'
import { useHoverState } from '@/src/hooks/useHoverState'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

export type MenuItemProps = {
  onClick?: () => void,
  alignment?: 'left' | 'right',
  isDisabled?: boolean,
  className?: string,
}
// TODO differentiate between buttons, links and toggleable items here
export const MenuItem = ({
  children,
  onClick,
  alignment = 'left',
  isDisabled = false,
  className
}: PropsWithChildren<MenuItemProps>) => (
  <div
    className={clsx('block px-3 py-1.5 first:rounded-t-md last:rounded-b-md text-sm font-semibold text-nowrap', {
      'text-right': alignment === 'right',
      'text-left': alignment === 'left',
      'text-disabled cursor-not-allowed': isDisabled,
      'text-menu-text hover:bg-primary/20': !isDisabled,
      'cursor-pointer': !!onClick,
    }, className)}
    onClick={onClick}
  >
    {children}
  </div>
)

function getScrollableParents(element) {
  const scrollables = []
  let parent = element.parentElement
  while (parent) {
    scrollables.push(parent)
    parent = parent.parentElement
  }
  return scrollables
}

export type MenuBag = {
  isOpen: boolean,
  disabled: boolean,
  toggleOpen: () => void,
  close: () => void,
}

export type MenuProps = {
  children: (bag: MenuBag) => ReactNode | ReactNode,
  trigger: (bag: MenuBag, ref: (el: HTMLElement | null) => void) => ReactNode,
  /**
   * @default 'l'
   */
  alignmentHorizontal?: PopoverHorizontalAlignment,
  alignmentVertical?: PopoverVerticalAlignment,
  showOnHover?: boolean,
  menuClassName?: string,
  disabled?: boolean,
}

/**
 * A Menu Component to allow the user to see different functions
 */
export const Menu = ({
  trigger,
  children,
  alignmentHorizontal = 'leftInside',
  alignmentVertical = 'bottomOutside',
  showOnHover = false,
  disabled = false,
  menuClassName = '',
}: MenuProps) => {
  const { isHovered: isOpen, setIsHovered: setIsOpen } = useHoverState({ isDisabled: !showOnHover || disabled })
  const triggerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))

  const [isHidden, setIsHidden] = useState<boolean>(true)
  const bag: MenuBag = {
    isOpen,
    close: () => setIsOpen(false),
    toggleOpen: () => setIsOpen(prevState => !prevState),
    disabled,
  }

  const menuPosition = usePopoverPosition(
    triggerRef.current?.getBoundingClientRect(),
    { verticalAlignment: alignmentVertical, horizontalAlignment: alignmentHorizontal, disabled }
  )

  useEffect(() => {
    if (!isOpen) return

    const triggerEl = triggerRef.current
    if (!triggerEl) return

    const scrollableParents = getScrollableParents(triggerEl)

    const close = () => setIsOpen(false)
    scrollableParents.forEach((parent) => {
      parent.addEventListener('scroll', close)
    })
    window.addEventListener('resize', close)

    return () => {
      scrollableParents.forEach((parent) => {
        parent.removeEventListener('scroll', close)
      })
      window.removeEventListener('resize', close)
    }
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false)
    }
  }, [isOpen])

  const { zIndex } = useOverlayRegistry({
    isActive: isOpen,
  })

  return (
    <>
      {trigger(bag, useCallback((el) => triggerRef.current = el, []))}
      {createPortal((
        <div
          ref={menuRef}
          onClick={e => e.stopPropagation()}
          className={clsx(
            'absolute rounded-md bg-menu-background text-menu-text shadow-around-lg shadow-strong z-[300]',
            {
              'animate-pop-in': isOpen,
              'animate-pop-out': !isOpen,
              'hidden': isHidden,
            },
            menuClassName
          )}
          onAnimationEnd={() => {
            if (!isOpen) {
              setIsHidden(true)
            }
          }}
          style={{
            ...menuPosition,
            zIndex
          }}
        >
          {BagFunctionUtil.resolve<MenuBag>(children, bag)}
        </div>
      ), document.body)}
    </>
  )
}

