'use client'

import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { useId } from 'react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Button } from '@/src/components/user-action/Button'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { createPortal } from 'react-dom'
import { useZIndexRegister } from '@/src/hooks/useZIndexRegister'

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
                         isAnimated = true,
                         containerClassName,
                         ...props
                       }: PropsWithChildren<DialogProps>) => {
  const translation = useHightideTranslation()
  const [visible, setVisible] = useState(isOpen)
  const generatedId = useId()
  const id = props.id ?? generatedId

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
    } else {
      if (!isAnimated) {
        setVisible(false)
      }
    }
  }, [isAnimated, isOpen])

  const onCloseWrapper = () => {
    if (!isModal) return
    onClose?.()
  }

  useLogOnce('Dialog: onClose should be defined for modal dialogs', isModal && !onClose)

  useFocusTrap({
    container: ref,
    active: visible,
    focusFirst: true,
  })

  const zIndex = useZIndexRegister(isOpen)

  const positionMap: Record<DialogPosition, string> = {
    top: 'fixed top-8 left-1/2 -translate-x-1/2',
    center: 'fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
    none: ''
  }
  const positionStyle = positionMap[position]

  if (!visible) return

  return createPortal(
    <div
      id={`dialog-container-${id}`}
      className={clsx('fixed inset-0 h-screen w-screen', containerClassName)}
      style={{ zIndex }}
    >
      <div
        id={`dialog-background-${id}`}
        hidden={!visible}
        className={clsx(
          'fixed inset-0 h-screen w-screen bg-overlay-shadow',
          {
            'motion-safe:animate-fade-in': isOpen,
            'motion-safe:animate-fade-out': !isOpen,
          },
          backgroundClassName
        )}
        onAnimationEnd={() => {
          if (!isOpen) {
            setVisible(false)
          }
        }}
        onClick={onCloseWrapper}
        aria-hidden={true}
      />
      <div
        {...props}
        id={`dialog-${id}`}
        ref={ref}
        hidden={!visible}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            onCloseWrapper()
          }
        }}
        onAnimationEnd={() => {
          if (!isOpen) {
            setVisible(false)
          }
        }}
        className={clsx(
          'flex-col-2 p-4 bg-overlay-background text-overlay-text rounded-xl shadow-hw-bottom max-w-[calc(100vw_-_2rem)] max-h-[calc(100vh_-_2rem)]',
          {
            'motion-safe:animate-pop-in': isOpen,
            'motion-safe:animate-pop-out': !isOpen,
          },
          positionStyle,
          props.className
        )}
      >
        <div className="typography-title-lg mr-8">
          {titleElement}
        </div>
        {description && (
          <div className="text-description">
            {description}
          </div>
        )}
        {isModal && (
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
              size="tiny"
              aria-label={translation('close')}
              onClick={onCloseWrapper}
            >
              <X/>
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
    , document.body
  )
}