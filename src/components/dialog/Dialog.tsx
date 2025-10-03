import type { PropsWithChildren, ReactNode } from 'react'
import { useRef } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useTranslation } from '@/src/localization/useTranslation'
import { formTranslation } from '@/src/localization/defaults/form'
import { IconButton } from '@/src/components/user-action/Button'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { createPortal } from 'react-dom'

export type DialogPosition = 'top' | 'center' | 'none'

export type DialogProps = {
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
  /** Styling for the main content */
  className?: string,
  /** If true shows a close button and sends onClose on background clicks */
  isModal?: boolean,
  position?: DialogPosition,
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
                         className,
                         backgroundClassName,
                         position = 'center',
                       }: PropsWithChildren<DialogProps>) => {
  const translation = useTranslation([formTranslation])

  const ref = useRef<HTMLDivElement>(null)

  const onCloseWrapper = () => {
    if (!isModal) return
    onClose?.()
  }

  useLogOnce('Dialog: onClose should be defined for modal dialogs', isModal && !onClose)

  useFocusTrap({
    container: ref,
    active: isOpen,
    focusFirst: true,
  })

  const positionMap: Record<DialogPosition, string> = {
    top: 'fixed top-8 left-1/2 -translate-x-1/2',
    center: 'fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
    none: ''
  }
  const positionStyle = positionMap[position]

  return createPortal(
    <>
      <div
        className={clsx(
          'fixed inset-0 h-screen w-screen bg-overlay-shadow',
          {
            'motion-safe:animate-fade-in': isOpen,
            'motion-safe:animate-fade-out': !isOpen,
          },
          backgroundClassName
        )}
        hidden={!isOpen}
        aria-hidden={true}
        onClick={onCloseWrapper}
      />
      <div
        ref={ref}
        hidden={!isOpen}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            onCloseWrapper()
          }
        }}
        className={clsx(
          'flex-col-2 p-4 bg-overlay-background text-overlay-text rounded-xl shadow-hw-bottom max-w-[calc(100vw_-_1rem)] max-h-[calc(100vh_-_1rem)]',
          {
            'motion-safe:animate-pop-in': isOpen,
            'motion-safe:animate-pop-out': !isOpen,
          },
          positionStyle,
          className
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
            <IconButton
              color="neutral"
              size="tiny"
              aria-label={translation('close')}
              onClick={onCloseWrapper}
            >
              <X/>
            </IconButton>
          </div>
        )}
        {children}
      </div>
    </>
    , document.body
  )
}