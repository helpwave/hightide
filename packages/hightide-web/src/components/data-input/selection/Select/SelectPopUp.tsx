import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpPanelProps } from '../../../layout/PopUp/PopUp'
import { useSelectContext } from './SelectContext'

export type SelectPopUpProps = PopUpPanelProps

export const SelectPopUp = forwardRef<HTMLDivElement, SelectPopUpProps>(function SelectPopUp(
  props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const context = useSelectContext()

  return (
    <PopUp.Panel
      {...props}
      panelRef={ref}
      id={context.config.ids.content}
      isOpen={context.isOpen}
      anchor={context.layout.triggerRef}
      forceMount={true}
      onClose={() => {
        context.setIsOpen(false)
        props.onClose?.()
      }}
      aria-labelledby={context.config.ids.trigger}
      className={clsx('select-content', props.className)}
    >
      {props.children}
    </PopUp.Panel>
  )
})
