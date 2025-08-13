import type { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useTranslation } from '@/src/localization/useTranslation'
import { formTranslation } from '@/src/localization/defaults/form'
import { IconButton } from '@/src/components/user-action/Button'
import type { FloatingContainerProps } from '@/src/components/layout-and-navigation/FloatingContainer'
import { FloatingContainer } from '@/src/components/layout-and-navigation/FloatingContainer'

export type DialogProps = Omit<FloatingContainerProps, 'backgroundOverlay'> & {
  /** Whether the dialog is currently open */
  isOpen: boolean,
  /** Title of the Dialog used for accessibility */
  titleEl: ReactNode,
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
}

/**
 * A generic dialog window which is managed by its parent
 */
export const Dialog = ({
                         children,
                         isOpen,
                         titleEl,
                         description,
                         isModal = true,
                         onClose,
                         horizontalAlignment = 'center',
                         verticalAlignment = 'center',
                         className,
                         backgroundClassName,
                       }: PropsWithChildren<DialogProps>) => {
  const translation = useTranslation([formTranslation])

  const onCloseWrapper = () => {
    if (!isModal) return
    onClose?.()
  }

  if (!isOpen) {
    return undefined
  }

  return (
    <FloatingContainer
      isFocusTrap={true}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          onCloseWrapper()
        }
      }}
      horizontalAlignment={horizontalAlignment}
      verticalAlignment={verticalAlignment}
      backgroundOverlay={(
        <div
          className={clsx(
            'fixed inset-0 h-screen w-screen bg-overlay-shadow',
            {
              'motion-safe:animate-fade-in': isOpen,
              'motion-safe:animate-fade-out': !isOpen,
            },
            backgroundClassName
          )}
          onClick={onCloseWrapper}
        />
      )}
      className={clsx(
        'flex-col-2 p-4 bg-overlay-background text-overlay-text rounded-xl shadow-hw-bottom',
        {
          'motion-safe:animate-pop-in': isOpen,
          'motion-safe:animate-pop-out': !isOpen,
        },
        className
      )}
    >
      <div className="typography-title-lg-semibold mr-8">
        {titleEl}
      </div>
      <div className="text-description">
        {description}
      </div>
      {isModal && (
        <IconButton
          className="absolute top-2 right-2"
          color="neutral"
          size="tiny"
          aria-label={translation('close')}
          onClick={onCloseWrapper}
        >
          <X/>
        </IconButton>
      )}
      {children}
    </FloatingContainer>
  )
}