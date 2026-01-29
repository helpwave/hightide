import { forwardRef, useCallback, useContext, useImperativeHandle, useMemo } from 'react'
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
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useScrollObserver } from '@/src/hooks/useScrollObserver'

export interface PopUpProps extends AnchoredFloatingContainerProps, Partial<UseOutsideClickHandlers> {
  isOpen?: boolean,
  focusTrapOptions?: Omit<UseFocusTrapProps, 'container'>,
  outsideClickOptions?: UseOutsideClickOptions,
  onClose?: () => void,
  forceMount?: boolean,
  anchorExcludedFromOutsideClick?: boolean,
}

export const PopUp = forwardRef<HTMLDivElement, PopUpProps>(function PopUp({
  children,
  isOpen: isOpenOverwrite,
  focusTrapOptions,
  onOutsideClick,
  onClose,
  outsideClickOptions,
  anchor: anchorOverwrite,
  forceMount = false,
  anchorExcludedFromOutsideClick = false,
  ...props
}, forwardRef) {
  const context = useContext(PopUpContext)
  const isOpen = isOpenOverwrite ?? context?.isOpen ?? false
  const anchor = anchorOverwrite ?? context?.triggerRef ?? undefined
  const id = props.id ?? context?.popUpId
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({ isOpen })

  useImperativeHandle(forwardRef, () => ref.current, [ref])

  const onCloseWrapper = useCallback(() => {
    onClose?.()
    context?.setIsOpen(false)
  }, [onClose, context])

  const { zIndex, isInFront } = useOverlayRegistry({ isActive: isOpen, tags: useMemo(() => ['popup'], []) })

  useOutsideClick({
    onOutsideClick: (event) => {
      event.preventDefault()
      onCloseWrapper()
      onOutsideClick?.(event)
    },
    active: isOpen && isInFront && (outsideClickOptions?.active ?? true),
    refs: [ref, ...(anchorExcludedFromOutsideClick ? [] : [anchor]), ...(outsideClickOptions?.refs ?? [])],
  })

  useScrollObserver({ observedElementRef: ref, onScroll: onCloseWrapper, isActive: isOpen })

  useLogOnce('PopUp: Either provide "aria-label" or "aria-labelledby"', !props['aria-label'] && !props['aria-labelledby'])

  return (
    <Visibility isVisible={isOpen || forceMount}>
      <Portal>
        <FocusTrap {...focusTrapOptions} active={isPresent && isOpen && (focusTrapOptions?.active ?? true)} container={ref}>
          <AnchoredFloatingContainer
            {...props}
            id={id}
            anchor={anchor}
            ref={refAssignment}
            active={isOpen}
            hidden={!isOpen && forceMount}

            onKeyDown={PropsUtil.aria.close(onCloseWrapper)}

            role="dialog"
            aria-modal={true}
            aria-hidden={!isOpen}

            style={{
              zIndex,
              position: 'fixed',
              overflow: 'hidden',
              transition: `top ${props.options?.pollingInterval ?? 100}ms linear, left ${props.options?.pollingInterval ?? 100}ms linear`,
              ...props.style
            }}
            className={clsx('pop-up', props.className)}
          >
            {children}
          </AnchoredFloatingContainer>
        </FocusTrap>
      </Portal>
    </Visibility>
  )
})
