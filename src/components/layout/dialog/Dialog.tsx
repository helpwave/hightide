'use client'

import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { useId, useMemo } from 'react'
import { useRef }  from 'react'
import { X } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Button } from '@/src/components/user-interaction/Button'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { createPortal } from 'react-dom'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { Visibility } from '../Visibility'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { DataAttributesUtil } from '@/src/utils/dataAttribute'

export type DialogPosition = 'top' | 'center' | 'none'

export type DialogProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the dialog is currently open */
  isOpen: boolean,
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
export const Dialog = ({
  children,
  isOpen,
  titleElement,
  description,
  isModal = true,
  onClose,
  backgroundClassName,
  position = 'center',
  containerClassName,
  ...props
}: PropsWithChildren<DialogProps>) => {
  const translation = useHightideTranslation()
  const generatedId = useId()
  const ids = useMemo(() => ({
    container: `dialog-container-${generatedId}` ,
    background: `dialog-background-${generatedId}` ,
    content: props.id ?? `dialog-content-${generatedId}`
  }), [generatedId, props.id])
  const ref = useRef<HTMLDivElement>(null)

  const onCloseWrapper = () => {
    if (!isModal) return
    onClose?.()
  }

  useLogOnce('Dialog: onClose should be defined for modal dialogs', isModal && !onClose)

  const { isVisible, transitionState, callbacks } = useTransitionState({ isOpen })

  useFocusTrap({
    container: ref,
    active: isVisible,
    focusFirst: true,
  })

  const { zIndex } = useOverlayRegistry({
    isActive: isVisible,
  })

  if (!isVisible) return

  return createPortal(
    <div
      id={ids.container}

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
      <div
        {...props}
        id={ids.content}
        ref={ref}

        onKeyDown={event => {
          if (event.key === 'Escape') {
            onCloseWrapper()
          }
        }}
        {...callbacks}

        data-name={DataAttributesUtil.name('dialog-content',props)}
        data-state={transitionState}
        data-position={position}

        className={props.className}
      >
        <div className="typography-title-lg mr-8">
          {titleElement}
        </div>
        <Visibility isVisible={!!description}>
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
            <Button
              layout="icon"
              color="neutral"
              size="xs"
              aria-label={translation('close')}
              onClick={onCloseWrapper}
            >
              <X/>
            </Button>
          </div>
        </Visibility>
        {children}
      </div>
    </div>
    , document.body
  )
}