import type { RefObject } from 'react'
import { forwardRef, useCallback, useContext, useMemo, useRef } from 'react'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils'
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
import { useLogOnce } from '@helpwave/hightide-utils'
import { PopUpContext } from './PopUpContext'
import { useOverlayRegistry } from '@helpwave/hightide-utils'
import { useScrollObserver } from '@/src/hooks/useScrollObserver'
import { ReactUtils } from '@helpwave/hightide-utils'

export interface PopUpProps extends Omit<AnchoredFloatingContainerProps, 'anchor'>, Partial<UseOutsideClickHandlers> {
  'isOpen'?: boolean,
  'focusTrapOptions'?: Omit<UseFocusTrapProps, 'container'>,
  'outsideClickOptions'?: Partial<UseOutsideClickOptions>,
  'onClose'?: () => void,
  'forceMount'?: boolean,
  'anchorExcludedFromOutsideClick'?: boolean,
  'anchor'?: RefObject<HTMLElement |null>,
  'data-name'?: string,
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
  const fallbackAnchorRef = useRef(null)
  const anchor = anchorOverwrite ?? context?.triggerRef ?? fallbackAnchorRef
  const id = props.id ?? context?.popUpId
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({ isOpen })

  const onCloseStable = useEventCallbackStabilizer(onClose)
  const onOutsideClickStable = useEventCallbackStabilizer(onOutsideClick)

  const onCloseWrapper = useCallback(() => {
    onCloseStable()
    context?.setIsOpen(false)
  }, [onCloseStable, context])

  const { zIndex, tagPositions } = useOverlayRegistry({ isActive: isOpen, tags: useMemo(() => ['popup'], []) })
  const isInFront = tagPositions?.['popup'] === 0

  const isOutsideClickActive = isOpen && isInFront && (outsideClickOptions?.active ?? true)

  useOutsideClick({
    onOutsideClick: useCallback((event: MouseEvent | TouchEvent) => {
      if(event.defaultPrevented) return
      onCloseWrapper()
      onOutsideClickStable(event)
      event.preventDefault()
    }, [onCloseWrapper, onOutsideClickStable]),
    active: isOutsideClickActive,
    refs: [ref, ...(anchorExcludedFromOutsideClick || !anchor ? [] : [anchor]), ...(outsideClickOptions?.refs ?? [])],
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
            ref={ReactUtils.assingRefsBuilder([refAssignment, forwardRef])}
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
              ...props.style
            }}
            data-name={props['data-name'] ?? 'pop-up'}
          >
            {children}
          </AnchoredFloatingContainer>
        </FocusTrap>
      </Portal>
    </Visibility>
  )
})
