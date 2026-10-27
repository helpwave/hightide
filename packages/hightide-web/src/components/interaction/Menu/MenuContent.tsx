import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import type { PopUpProps } from '../../layout/PopUp/PopUp'
import { PopUp } from '../../layout/PopUp/PopUp'
import { useMenuContext } from './MenuContext'

export type MenuContentProps = Omit<PopUpProps, 'isOpen' | 'anchor' | 'children'> & {
  children?: ReactNode,
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent({
  children,
  onClose,
  className,
  outsideClickOptions,
  ...props
}, ref) {
  const { state, dispatch, disabled, triggerRef } = useMenuContext()
  const isOpen = state.isOpen && !disabled

  return (
    <PopUp
      role="menu"
      {...props}
      ref={ref}
      isOpen={isOpen}
      anchor={triggerRef}
      outsideClickOptions={{
        ...outsideClickOptions,
        refs: [triggerRef, ...(outsideClickOptions?.refs ?? [])],
        active: isOpen && (outsideClickOptions?.active ?? true),
      }}
      onClose={() => {
        onClose?.()
        dispatch({ type: 'close' })
      }}
      className={clsx('menu', className)}
    >
      {children}
    </PopUp>
  )
})
