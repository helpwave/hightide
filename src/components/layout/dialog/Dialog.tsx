'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useContext, useId, useImperativeHandle, useMemo, useRef } from 'react'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'
import { X } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { Visibility } from '../Visibility'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'
import { Portal } from '../../utils/Portal'
import { FocusTrap } from '../../utils/FocusTrap'
import { usePresenceRef } from '@/src/hooks/usePresenceRef'
import { DialogContext } from './DialogContext'
import { IconButton } from '../../user-interaction/IconButton'

export type DialogPosition = 'top' | 'center' | 'none'

export type DialogProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the dialog is currently open */
  isOpen?: boolean,
  /** Title of the Dialog used for accessibility */
  titleElement: ReactNode,
  /** Description of the Dialog used for accessibility */
  description: ReactNode,
  /** Callback when the dialog tries to close */
  onClose?: () => void,
  /** Styling for the background */
  backgroundClassName?: string,
  /** If true shows a close button and sends onClose on background clicks */
  isModal?: boolean,
  position?: DialogPosition,
  isAnimated?: boolean,
  containerClassName?: string,
}

/**
 * A generic dialog window which is managed by its parent
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog({
  children,
  isOpen: isOpenOverwrite,
  titleElement,
  description,
  isModal: isModalOverwrite = true,
  onClose,
  backgroundClassName,
  position = 'center',
  containerClassName,
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const generatedId = useId()
  const ids = useMemo(() => ({
    container: `dialog-container-${generatedId}`,
    background: `dialog-background-${generatedId}`,
    content: props.id ?? `dialog-content-${generatedId}`,
    title: `dialog-title-${generatedId}`,
    description: `dialog-description-${generatedId}`,
  }), [generatedId, props.id])

  const containerRef = useRef<HTMLDivElement>(null)
  const context = useContext(DialogContext)
  const isOpen = isOpenOverwrite ?? context?.isOpen ?? false
  const isModal = isModalOverwrite ?? context?.isModal ?? true

  const { refAssignment, isPresent, ref } = usePresenceRef<HTMLDivElement>({
    isOpen,
  })
  useImperativeHandle(forwardedRef, () => ref.current, [ref])

  const onCloseStable = useEventCallbackStabilizer(onClose)
  const onCloseWrapper = useCallback(() => {
    if (!isModal) return
    onCloseStable()
    context?.setIsOpen(false)
  }, [onCloseStable, context, isModal])

  useLogOnce('Dialog: onClose should be defined for modal dialogs', isModal && !onClose && !context)

  const { isVisible, transitionState } = useTransitionState({ isOpen, ref: containerRef })

  useFocusTrap({
    container: ref,
    active: isVisible,
  })

  const { zIndex } = useOverlayRegistry({
    isActive: isVisible,
  })

  const hasDescription = !!description

  return (
    <Visibility isVisible={isVisible}>
      <Portal>
        <div
          ref={containerRef}
          id={ids.container}

          data-open={PropsUtil.dataAttributes.bool(isOpen)}

          data-name="dialog-container"
          className={containerClassName}
          style={{ zIndex }}
        >
          <div
            id={ids.background}

            onClick={onCloseWrapper}

            data-name="dialog-background"
            data-state={transitionState}

            aria-hidden={true}

            className={backgroundClassName}
          />
          <FocusTrap active={isPresent && isOpen} container={ref}>
            <div
              {...props}
              id={ids.content}
              ref={refAssignment}

              onKeyDown={PropsUtil.aria.close(onCloseWrapper)}

              data-state={transitionState}
              data-position={position}

              role="dialog"
              aria-modal={isModal}
              aria-labelledby={ids.title}
              aria-describedby={hasDescription ? ids.description : undefined}

              data-name={props['data-name'] ?? 'dialog-content'}
            >
              <div className="typography-title-lg mr-10">
                {titleElement}
              </div>
              <Visibility isVisible={hasDescription}>
                <div className="text-description">
                  {description}
                </div>
              </Visibility>
              <Visibility isVisible={isModal}>
                <div
                  className="absolute top-0 right-0"
                  style={{
                    paddingTop: 'inherit',
                    paddingRight: 'inherit'
                  }}
                >
                  <IconButton
                    tooltip={translation('closeDialog')}
                    size="xs"
                    color="neutral"
                    coloringStyle="text"
                    onClick={onCloseWrapper}
                  >
                    <X size={24}/>
                  </IconButton>
                </div>
              </Visibility>
              {children}
            </div>
          </FocusTrap>
        </div>
      </Portal>
    </Visibility>
  )
})