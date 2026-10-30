import type { ForwardedRef } from 'react'
import { forwardRef, useEffect } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpProps } from '../../../layout/PopUp/PopUp'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectPopUpProps = PopUpProps

export const MultiSelectPopUp = forwardRef<HTMLDivElement, MultiSelectPopUpProps>(function MultiSelectPopUp({
  id,
  ...props
}, ref: ForwardedRef<HTMLDivElement>) {
  const context = useMultiSelectContext()
  const { setIds } = context.config

  useEffect(() => {
    if (id) setIds((prev) => ({ ...prev, content: id }))
  }, [id, setIds])

  return (
    <PopUp
      {...props}
      ref={ref}
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
    </PopUp>
  )
})
