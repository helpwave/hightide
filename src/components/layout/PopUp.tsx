import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Portal } from '../utils/Portal'
import type { AnchoredFloatingContainerProps } from './AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from './AnchoredFloatingContainer'
import { Visibility } from './Visibility'
import type { UseFocusTrapProps } from '@/src/hooks/focus/useFocusTrap'
import { FocusTrap } from '../utils/FocusTrap'
import { useOutsideClick, type UseOutsideClickProps } from '@/src/hooks/useOutsideClick'
import { PropsUtil } from '@/src/utils/propsUtil'

export interface PopUpProps extends AnchoredFloatingContainerProps {
  isOpen?: boolean,
  focusTrapOptions?: Omit<UseFocusTrapProps, 'container'>,
  outsideClickOptions?: Omit<UseOutsideClickProps, 'handler'>,
  onOutsideClick?: (event: MouseEvent | TouchEvent) => void,
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
  const innerRef = useRef<HTMLDivElement>(null)
  const [hasContainer, setHasContainer] = useState(false)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    innerRef.current = node
    setHasContainer(prev => prev || !!node)
  }, [])

  useEffect(() => {
    if(!isOpen) {
      setHasContainer(false)
    }
  }, [isOpen])

  useImperativeHandle(forwardRef, () => innerRef.current, [])

  useOutsideClick({
    handler: (event) => {
      event.preventDefault()
      onClose?.()
      onOutsideClick?.(event)
    },
    active: outsideClickOptions?.active && isOpen,
    refs: [innerRef, ...(outsideClickOptions?.refs ?? [])],
  })

  return (
    <FocusTrap {...focusTrapOptions} active={hasContainer && isOpen && (focusTrapOptions?.active ?? true)} container={innerRef}>
      <Visibility isVisible={isOpen}>
        <Portal>
          <AnchoredFloatingContainer
            {...props}
            ref={containerRef}

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
        </Portal>
      </Visibility>
    </FocusTrap>
  )
})