import { type PropsWithChildren, type ReactNode, type RefObject, useRef } from 'react'
import clsx from 'clsx'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useHoverState } from '../../hooks/useHoverState'
import type { PropsWithBagFunctionOrChildren } from '../../util/PropsWithFunctionChildren'
import { BagFunctionUtil } from '../../util/PropsWithFunctionChildren'

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
    className={clsx('block px-3 py-1.5 bg-menu-background first:rounded-t-lg last:rounded-b-lg text-sm font-semibold', {
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

type MenuBag = {
  isOpen: boolean,
  close: () => void,
}

export type MenuProps<T> = PropsWithBagFunctionOrChildren<MenuBag> & {
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode,
  /**
   * @default 'l'
   */
  alignmentHorizontal?: 'w' | 'e' | 'l' | 'r' | 'c',
  alignmentVertical?: 'n' | 's' | 't' | 'b' | 'c',
  showOnHover?: boolean,
  menuClassName?: string,
}

/**
 * A Menu Component to allow the user to see different functions
 */
export const Menu = <T extends HTMLElement>({
                                              trigger,
                                              children,
                                              alignmentHorizontal,
                                              alignmentVertical,
                                              showOnHover = false,
                                              menuClassName = '',
                                            }: MenuProps<T>) => {
  const { isHovered: isOpen, setIsHovered: setIsOpen, handlers } = useHoverState({ isDisabled: !showOnHover })
  const triggerRef = useRef<T>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))

  const bag: MenuBag = { isOpen, close: () => setIsOpen(false) }

  return (
    <div
      className="relative max-w-min"
      {...handlers}
    >
      {trigger(() => setIsOpen(!isOpen), triggerRef)}
      <div
        ref={menuRef}
        onClick={e => e.stopPropagation()}
        className={clsx(
          'absolute rounded-md bg-menu-background text-menu-text shadow-around-lg z-10',
          {
            'right-full': alignmentHorizontal === 'l',
            'left-full': alignmentHorizontal === 'r',
            'right-0': alignmentHorizontal === 'w',
            'left-0': alignmentHorizontal === 'e',
            'left-1/2 -translate-x-1/2': alignmentHorizontal === 'c',
            'bottom-full': alignmentVertical === 't',
            'top-full': alignmentVertical === 'b',
            'bottom-0': alignmentVertical === 'n',
            'top-0': alignmentVertical === 's',
            'top-1/2 -translate-y-1/2': alignmentVertical === 'c',
            'hidden': !isOpen,
          },
          menuClassName
        )}
      >
        {BagFunctionUtil.resolve<MenuBag>(children, bag)}
      </div>
    </div>
  )
}

