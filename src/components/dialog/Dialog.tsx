import type { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useTranslation } from '@/src/localization/useTranslation'
import { formTranslation } from '@/src/localization/defaults/form'
import { IconButton } from '@/src/components/user-action/Button'

export type DialogProps = PropsWithChildren<{
  /** Whether the dialog is currently open */
  isOpen: boolean,
  /** Title of the Dialog used for accessibility */
  title: ReactNode,
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
}>

/**
 * A generic dialog window which is managed by its parent
 */
export const Dialog = ({
                         children,
                         isOpen,
                         title,
                         description,
                         isModal = true,
                         onClose,
                         className,
                         backgroundClassName,
                       }: PropsWithChildren<DialogProps>) => {
  const translation = useTranslation([formTranslation])

  const onCloseWrapper = () => {
    if (!isModal) return
    onClose?.()
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      defaultOpen={false}
      modal={isModal}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onCloseWrapper()
        }
      }}
    >
      <DialogPrimitive.Overlay
        className={clsx(
          'fixed inset-0 h-screen w-screen bg-overlay-shadow',
          {
            'motion-safe:animate-fade-in': isOpen,
            'motion-safe:animate-fade-out': !isOpen,
          },
          backgroundClassName
        )}
      />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          onEscapeKeyDown={onCloseWrapper}
          className={clsx(
            'fixed top-1/2 left-1/2 -translate-1/2',
            'flex-col-2 p-4 bg-overlay-background text-overlay-text rounded-xl shadow-hw-bottom',
            {
              'motion-safe:animate-pop-in': isOpen,
              'motion-safe:animate-pop-out': !isOpen,
            },
            className
          )}
        >
          <DialogPrimitive.Title className="typography-title-lg-semibold mr-8">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-description">
            {description}
          </DialogPrimitive.Description>
          {isModal && (
            <DialogPrimitive.Close asChild={true}>
              <IconButton
                className="absolute top-2 right-2"
                color="neutral"
                size="tiny"
                aria-label={translation('close')}
                onClick={onCloseWrapper}
              >
                <X/>
              </IconButton>
            </DialogPrimitive.Close>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}