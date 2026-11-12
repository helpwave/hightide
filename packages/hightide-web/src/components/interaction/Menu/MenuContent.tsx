import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpPanelProps } from '../../layout/PopUp/PopUp'
import { useMenuContext } from './MenuContext'

export type MenuContentProps = Omit<PopUpPanelProps, 'isOpen' | 'anchor' | 'children'> & {
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
    <PopUp.Panel
      role="menu"
      {...props}
      panelRef={ref}
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
    </PopUp.Panel>
  )
})
