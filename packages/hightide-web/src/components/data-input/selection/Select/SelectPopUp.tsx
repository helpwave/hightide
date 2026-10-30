import type { ForwardedRef } from 'react'
import { forwardRef, useEffect } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpProps } from '../../../layout/PopUp/PopUp'
import { useSelectContext } from './SelectContext'

export type SelectPopUpProps = PopUpProps

export const SelectPopUp = forwardRef<HTMLDivElement, SelectPopUpProps>(function SelectPopUp({
  id,
  ...props
}, ref: ForwardedRef<HTMLDivElement>) {
  const context = useSelectContext()
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
      className={clsx('select-content', props.className)}
    >
      {props.children}
    </PopUp>
  )
})
