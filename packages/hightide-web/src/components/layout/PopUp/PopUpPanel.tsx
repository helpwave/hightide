import clsx from 'clsx'
import type { Ref, RefObject } from 'react'
import { useCallback, useContext, useMemo, useRef } from 'react'
import { useLogOnce, useOverlayRegistry, useStableEvent } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { Portal } from '../Portal'
import type { AnchoredFloatingContainerProps } from '../AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from '../AnchoredFloatingContainer'
import { Visibility } from '../Visibility'
import type { UseFocusTrapProps } from '../../../hooks/focus/useFocusTrap'
import { FocusTrap } from '../../interaction/FocusTrap'
import type { UseOutsideClickHandlers, UseOutsideClickOptions } from '../../../hooks/useOutsideClick'
import { useOutsideClick } from '../../../hooks/useOutsideClick'
import { usePresenceRef } from '../../../hooks/usePresenceRef'
import { useScrollObserver } from '../../../hooks/useScrollObserver'
import { PropsUtil } from '../../../utils/propsUtil'
import { ColoringUtils } from '../../interaction'
import { PopUpContext } from './PopUpContext'

export interface PopUpPanelProps extends Omit<AnchoredFloatingContainerProps, 'anchor'>, Partial<UseOutsideClickHandlers> {
  isOpen?: boolean,
  focusTrapOptions?: Omit<UseFocusTrapProps, 'container'>,
  outsideClickOptions?: Partial<UseOutsideClickOptions>,
  onClose?: () => void,
  forceMount?: boolean,
  anchorExcludedFromOutsideClick?: boolean,
  anchor?: RefObject<HTMLElement | null>,
  panelRef?: Ref<HTMLDivElement>,
}

export function PopUpPanel({
  children,
  isOpen: isOpenOverwrite,
  focusTrapOptions,
  onOutsideClick,
  onClose,
  outsideClickOptions,
  anchor: anchorOverwrite,
  forceMount = false,
  anchorExcludedFromOutsideClick = false,
  panelRef,
  ...props
}: PopUpPanelProps) {
  const context = useContext(PopUpContext)
  const isOpen = isOpenOverwrite ?? context?.state.isOpen ?? false
  const fallbackAnchorRef = useRef<HTMLElement | null>(null)
  const anchor = anchorOverwrite ?? context?.triggerRef ?? fallbackAnchorRef
  const id = props.id ?? context?.popUpId
  const dispatch = context?.dispatch
  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({ isOpen })

  const onCloseStable = useStableEvent(onClose)
  const onOutsideClickStable = useStableEvent(onOutsideClick)

  const onCloseWrapper = useCallback(() => {
    onCloseStable()
    dispatch?.({ type: 'close' })
  }, [dispatch, onCloseStable])

  const { zIndex, tagPositions } = useOverlayRegistry({ isActive: isOpen, tags: useMemo(() => ['popup'], []) })
  const isInFront = tagPositions?.['popup'] === 0

  const isOutsideClickActive = isOpen && isInFront && (outsideClickOptions?.active ?? true)

  useOutsideClick({
    onOutsideClick: useCallback((event: MouseEvent | TouchEvent) => {
      if(event.defaultPrevented) return
      onCloseWrapper()
      onOutsideClickStable(event)
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
            {...ColoringUtils.build({ color: 'surface' })}
            {...props}
            id={id}
            anchor={anchor}
            ref={ReactUtils.assingRefsBuilder([refAssignment, panelRef])}
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
            className={clsx('pop-up', props.className)}
          >
            {children}
          </AnchoredFloatingContainer>
        </FocusTrap>
      </Portal>
    </Visibility>
  )
}
