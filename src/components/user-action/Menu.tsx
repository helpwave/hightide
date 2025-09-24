import { type PropsWithChildren, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useHoverState } from '../../hooks/useHoverState'
import type { PropsWithBagFunctionOrChildren } from '@/src/utils/bagFunctions'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import type { PopoverHorizontalAlignment, PopoverVerticalAlignment } from '../../hooks/usePopoverPosition'
import { usePopoverPosition } from '../../hooks/usePopoverPosition'
import { createPortal } from 'react-dom'

export type MenuItemProps = {
  onClick?: () => void,
  alignment?: 'left' | 'right',
  isDisabled?: boolean,
  className?: string,
}
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
      'text-disabled-text cursor-not-allowed': isDisabled,
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

export type MenuProps<T> = PropsWithBagFunctionOrChildren<MenuBag> & {
  trigger: (bag: MenuBag, ref: RefObject<T>) => ReactNode,
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
export const Menu = <T extends HTMLElement>({
                                              trigger,
                                              children,
                                              alignmentHorizontal = 'leftInside',
                                              alignmentVertical = 'bottomOutside',
                                              showOnHover = false,
                                              disabled = false,
                                              menuClassName = '',
                                            }: MenuProps<T>) => {
  const { isHovered: isOpen, setIsHovered: setIsOpen } = useHoverState({ isDisabled: !showOnHover || disabled })
  const triggerRef = useRef<T>(null)
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

  return (
    <>
      {trigger(bag, triggerRef)}
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
            ...menuPosition
          }}
        >
          {BagFunctionUtil.resolve<MenuBag>(children, bag)}
        </div>
      ), document.body)}
    </>
  )
}

