import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpPanelProps } from '../../../layout/PopUp/PopUp'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectPopUpProps = PopUpPanelProps

export const MultiSelectPopUp = forwardRef<HTMLDivElement, MultiSelectPopUpProps>(function MultiSelectPopUp(
  props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const context = useMultiSelectContext()

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
      className={clsx('multi-select-content', props.className)}
    >
      {props.children}
    </PopUp.Panel>
  )
})
