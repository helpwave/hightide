import { forwardRef, useImperativeHandle } from 'react'
import { clsx } from 'clsx'
import { Portal } from '../utils/Portal'
import type { AnchoredFloatingContainerProps } from './AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from './AnchoredFloatingContainer'
import { Visibility } from './Visibility'
import type { UseFocusTrapProps } from '@/src/hooks/focus/useFocusTrap'
import { FocusTrap } from '../utils/FocusTrap'
import type { UseOutsideClickHandlers, UseOutsideClickOptions } from '@/src/hooks/useOutsideClick'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'
import { PropsUtil } from '@/src/utils/propsUtil'
import { usePresenceRef } from '@/src/hooks/usePresenceRef'

export interface PopUpProps extends AnchoredFloatingContainerProps, Partial<UseOutsideClickHandlers> {
  isOpen?: boolean,
  focusTrapOptions?: Omit<UseFocusTrapProps, 'container'>,
  outsideClickOptions?: UseOutsideClickOptions,
  onClose?: () => void,
}

export const PopUp = forwardRef<HTMLDivElement, PopUpProps>(function PopUp({
  children,
  isOpen = false,
  focusTrapOptions,
  onOutsideClick,
  onClose,
  outsideClickOptions,
  ...props
}, forwardRef) {
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({
    isOpen,
  })

  useImperativeHandle(forwardRef, () => ref.current, [ref])

  useOutsideClick({
    onOutsideClick: (event) => {
      event.preventDefault()
      onClose?.()
      onOutsideClick?.(event)
    },
    active: outsideClickOptions?.active && isOpen,
    refs: [ref, ...(outsideClickOptions?.refs ?? [])],
  })

  return (
    <Visibility isVisible={isOpen}>
      <Portal>
        <FocusTrap {...focusTrapOptions} active={isPresent && isOpen && (focusTrapOptions?.active ?? true)} container={ref}>
          <AnchoredFloatingContainer
            {...props}
            ref={refAssignment}

            onKeyDown={PropsUtil.aria.close(onClose)}

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
