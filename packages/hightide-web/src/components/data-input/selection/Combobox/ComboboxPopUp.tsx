import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { PopUp, type PopUpProps } from '../../../layout/PopUp/PopUp'
import { useComboboxContext } from './ComboboxContext'

export type ComboboxPopUpProps = PopUpProps

export const ComboboxPopUp = forwardRef<HTMLDivElement, ComboboxPopUpProps>(function ComboboxPopUp(
  props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const context = useComboboxContext()

  return (
    <PopUp
      {...props}
      ref={ref}
      id={context.config.ids.popup}
      isOpen={context.isOpen}
      anchor={context.layout.searchbarRef}
      focusTrapOptions={{ active: false, ...props.focusTrapOptions }}
      onClose={() => {
        context.setIsOpen(false)
        props.onClose?.()
      }}
      aria-labelledby={context.config.ids.trigger}
      className={clsx('combobox-popup', props.className)}
    >
      {props.children}
    </PopUp>
  )
})
