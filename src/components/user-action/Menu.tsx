import { type PropsWithChildren, type ReactNode, type RefObject, useRef } from 'react'
import clsx from 'clsx'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useHoverState } from '../../hooks/useHoverState'

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
    className={clsx('block px-3 py-1 bg-menu-background', {
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

export type MenuProps<T> = PropsWithChildren<{
  trigger: (onClick: () => void, ref: RefObject<T>) => ReactNode,
  /**
   * @default 'tl'
   */
  alignment?: 'tl' | 'tr' | 'bl' | 'br' | '_l' | '_r' | 't_' | 'b_',
  showOnHover?: boolean,
  menuClassName?: string,
}>

/**
 * A Menu Component to allow the user to see different functions
 */
export const Menu = <T extends HTMLElement>({
                                       trigger,
                                       children,
                                       alignment = 'tl',
                                       showOnHover = false,
                                       menuClassName = '',
                                     }: MenuProps<T>) => {
  const { isHovered: isOpen, setIsHovered: setIsOpen, handlers } = useHoverState({ isDisabled: !showOnHover })
  const triggerRef = useRef<T>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))

  return (
    <div
      className="relative"
      {...handlers}
    >
      {trigger(() => setIsOpen(!isOpen), triggerRef)}
      {isOpen ? (
        <div ref={menuRef} onClick={e => e.stopPropagation()}
             className={clsx('absolute top-full mt-1 py-2 w-60 rounded-lg bg-menu-background text-menu-text ring-1 ring-slate-900/5 text-sm leading-6 font-semibold shadow-md z-[1]', {
               'top-0': alignment[0] === 't',
               'bottom-0': alignment[0] === 'b',
               'left-0': alignment[1] === 'l',
               'right-0': alignment[1] === 'r',
             }, menuClassName)}>
          {children}
        </div>
      ) : null}
    </div>
  )
}