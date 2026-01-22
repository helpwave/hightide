import { forwardRef, useContext, useImperativeHandle } from 'react'
import { clsx } from 'clsx'
import { Portal } from '../../utils/Portal'
import type { AnchoredFloatingContainerProps } from '../AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from '../AnchoredFloatingContainer'
import { Visibility } from '../Visibility'
import type { UseFocusTrapProps } from '@/src/hooks/focus/useFocusTrap'
import { FocusTrap } from '../../utils/FocusTrap'
import type { UseOutsideClickHandlers, UseOutsideClickOptions } from '@/src/hooks/useOutsideClick'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'
import { PropsUtil } from '@/src/utils/propsUtil'
import { usePresenceRef } from '@/src/hooks/usePresenceRef'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { PopUpContext } from './PopUpContext'

export interface PopUpProps extends AnchoredFloatingContainerProps, Partial<UseOutsideClickHandlers> {
  isOpen?: boolean,
  focusTrapOptions?: Omit<UseFocusTrapProps, 'container'>,
  outsideClickOptions?: UseOutsideClickOptions,
  onClose?: () => void,
}

export const PopUp = forwardRef<HTMLDivElement, PopUpProps>(function PopUp({
  children,
  isOpen: isOpenOverwrite,
  focusTrapOptions,
  onOutsideClick,
  onClose,
  outsideClickOptions,
  anchor: anchorOverwrite,
  ...props
}, forwardRef) {
  const context = useContext(PopUpContext)
  const isOpen = isOpenOverwrite ?? context?.isOpen ?? false
  const anchor = anchorOverwrite ?? context?.triggerRef ?? undefined
  const id = props.id ?? context?.popUpId
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({ isOpen })

  useImperativeHandle(forwardRef, () => ref.current, [ref])

  const onCloseWrapper = () => {
    onClose?.()
    context?.setIsOpen(false)
  }


  useOutsideClick({
    onOutsideClick: (event) => {
      event.preventDefault()
      onCloseWrapper()
      onOutsideClick?.(event)
    },
    active: isOpen && (outsideClickOptions?.active ?? true),
    refs: [ref, ...(outsideClickOptions?.refs ?? [])],
  })

  useLogOnce('PopUp: Either provide "aria-label" or "aria-labelledby"', !props['aria-label'] && !props['aria-labelledby'])

  return (
    <Visibility isVisible={isOpen}>
      <Portal>
        <FocusTrap {...focusTrapOptions} active={isPresent && isOpen && (focusTrapOptions?.active ?? true)} container={ref}>
          <AnchoredFloatingContainer
            {...props}
            id={id}
            anchor={anchor}
            ref={refAssignment}

            onKeyDown={PropsUtil.aria.close(onCloseWrapper)}

            role="dialog"
            aria-modal={true}

            style={{
              position: 'fixed',
              overflow: 'hidden',
              transition: `top ${props.options?.pollingInterval ?? 100}ms linear, left ${props?.options.pollingInterval ?? 100}ms linear`,
              ...props.style
            }}
            className={clsx(
              'surface coloring-solid rounded-md border-2 border-outline-variant shadow-md',
              'data-positioned:animate-pop-in',
              'focus-within:border-primary',
              'not:data-position:opacity-0',
              props.className
            )}
          >
            {children}
          </AnchoredFloatingContainer>
        </FocusTrap>
      </Portal>
    </Visibility>
  )
})
