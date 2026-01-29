import { type PropsWithChildren, type ReactNode, useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import type { PopUpProps } from '../layout/popup/PopUp'
import { PopUp } from '../layout/popup/PopUp'

export type MenuItemProps = {
  onClick?: () => void,
  isDisabled?: boolean,
  className?: string,
}
// TODO differentiate between buttons, links and toggleable items here
export const MenuItem = ({
  children,
  onClick,
  isDisabled = false,
  className
}: PropsWithChildren<MenuItemProps>) => (
  <div
    className={clsx('block px-3 py-1.5 first:rounded-t-md last:rounded-b-md text-sm font-semibold text-nowrap', {
      'text-disabled cursor-not-allowed': isDisabled,
      'text-menu-text hover:bg-primary/20': !isDisabled,
      'cursor-pointer': !!onClick,
    }, className)}
    onClick={onClick}
  >
    {children}
  </div>
)

export type MenuBag = {
  isOpen: boolean,
  disabled: boolean,
  toggleOpen: () => void,
  close: () => void,
}

export interface MenuProps extends Omit<PopUpProps, 'children' | 'anchor'> {
  children: (bag: MenuBag) => ReactNode | ReactNode,
  trigger: (bag: MenuBag, ref: (el: HTMLElement | null) => void) => ReactNode,
  disabled?: boolean,
}

/**
 * A Menu Component to allow the user to see different functions
 */
export const Menu = ({
  trigger,
  children,
  disabled = false,
  ...props
}: MenuProps) => {
  const triggerRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const bag: MenuBag = {
    isOpen,
    close: () => setIsOpen(false),
    toggleOpen: () => setIsOpen(prevState => !prevState),
    disabled,
  }

  return (
    <>
      {trigger(bag, useCallback((el) => triggerRef.current = el, []))}
      <PopUp
        {...props}
        isOpen={isOpen && !disabled}
        anchor={triggerRef}

        outsideClickOptions={{
          refs: [triggerRef, ...(props.outsideClickOptions?.refs ?? [])],
          active: isOpen && !disabled && (props.outsideClickOptions?.active ?? true),
        }}

        onOutsideClick={(event) => {
          props.onOutsideClick?.(event)
          setIsOpen(false)
        }}
      >
        {BagFunctionUtil.resolve<MenuBag>(children, bag)}
      </PopUp>
    </>
  )
}

