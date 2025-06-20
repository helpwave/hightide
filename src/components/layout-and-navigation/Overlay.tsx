import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { Tooltip } from '@/components/user-action/Tooltip'
import { X } from 'lucide-react'
import { IconButton } from '@/components/user-action/Button'
import type { PropsForTranslation } from '@/localization/useTranslation'
import { useTranslation } from '@/localization/useTranslation'
import type { Language } from '@/localization/util'

export type OverlayProps = PropsWithChildren<{
  /**
   * Whether the overlay should be currently displayed
   */
  isOpen: boolean,
  /**
   *  Callback when the background is clicked
   */
  onBackgroundClick?: () => void,
  /**
   *  Styling for the background
   *
   *  To remove the darkening, set bg-transparent
   */
  backgroundClassName?: string,
}>

/**
 * A generic overlay window which is managed by its parent
 */
export const Overlay = ({
                          children,
                          isOpen,
                          onBackgroundClick,
                          backgroundClassName,
                        }: PropsWithChildren<OverlayProps>) => {
  // The element to which the overlay will be attached to
  const [root, setRoot] = useState<HTMLElement>()

  useEffect(() => {
    setRoot(document.body)
  }, [])

  if (!root || !isOpen) return null


  return ReactDOM.createPortal(
    <div className={clsx('fixed inset-0 z-[9999]')}>
      <div
        className={clsx('fixed inset-0 h-screen w-screen bg-black/30', backgroundClassName)}
        onClick={onBackgroundClick}
      />
      {children}
    </div>,
    root
  )
}


let overlayStack: HTMLDivElement[] = []


// --- Modal ---

type ModalHeaderTranslation = {
  close: string,
}

const defaultModalHeaderTranslation: Record<Language, ModalHeaderTranslation> = {
  en: {
    close: 'Close'
  },
  de: {
    close: 'Schließen'
  }
}

export type ModalHeaderProps = {
  onCloseClick?: () => void,
  /** The title of the Modal. If you want to only set the text use `titleText` instead */
  title?: ReactNode,
  /** The title text of the Modal. If you want to set a custom title use `title` instead */
  titleText?: string,
  /** The description of the Modal. If you want to only set the text use `descriptionText` instead */
  description?: ReactNode,
  /** The description text of the Modal. If you want to set a custom description use `description` instead */
  descriptionText?: string,
}

/**
 * A default Header to be used by modal to have a uniform design
 */
export const ModalHeader = ({
                              overwriteTranslation,
                              onCloseClick,
                              title,
                              titleText = '',
                              description,
                              descriptionText = ''
                            }: PropsForTranslation<ModalHeaderTranslation, ModalHeaderProps>) => {
  const translation = useTranslation(defaultModalHeaderTranslation, overwriteTranslation)
  const hasTitleRow = !!title || !!titleText || !!onCloseClick
  const titleRow = (
    <div className="row justify-between items-start gap-x-8">
      {title ?? (
        <h2
          className={clsx('textstyle-title-lg', {
            'mb-1': description || descriptionText,
          })}
        >
          {titleText}
        </h2>
      )}
      {!!onCloseClick && (
        <Tooltip tooltip={translation.close}>
          <IconButton color="neutral" size="small" onClick={onCloseClick}>
            <X className="w-full h-full"/>
          </IconButton>
        </Tooltip>
      )}
    </div>
  )

  return (
    <div className="col">
      {hasTitleRow && (titleRow)}
      {description ?? (descriptionText && (<span className="textstyle-description">{descriptionText}</span>))}
    </div>
  )
}

export type ModalProps = {
  isOpen: boolean,
  onClose: () => void,
  className?: string,
  backgroundClassName?: string,
  headerProps?: Omit<ModalHeaderProps, 'onCloseClick'>,
}

/**
 * A Generic Modal Window
 */
export const Modal = ({
                        children,
                        isOpen,
                        onClose,
                        className,
                        backgroundClassName,
                        headerProps,
                      }: PropsWithChildren<ModalProps>) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const modal = ref.current

    if (!modal) {
      console.error('modal open, but no ref found')
      return
    }

    overlayStack.push(modal)

    const focusable = modal?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      const isTopmost = overlayStack[overlayStack.length - 1] === modal
      if (!isTopmost) return

      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab') {
        if (focusable.length === 0) return

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus()
        }
      }
    }

    modal.focus()
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      overlayStack = overlayStack.filter(m => m !== modal)
    }
  }, [isOpen, onClose])

  return (
    <Overlay
      isOpen={isOpen}
      onBackgroundClick={onClose}
      backgroundClassName={backgroundClassName}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={clsx(
          'fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 col p-4 bg-overlay-background text-overlay-text rounded-xl shadow-xl',
          className
        )}
        role="dialog"
        aria-modal={true}
      >
        <ModalHeader {...headerProps} onCloseClick={onClose}/>
        {children}
      </div>
    </Overlay>
  )
}

// --- Dialog ---

export type DialogProps = Omit<OverlayProps, 'onBackgroundClick'> & {
  title?: ReactNode,
  titleText?: string,
  className?: string,
}

/*
 * A Generic Dialog Window
 */
export const Dialog = ({
                         children,
                         isOpen,
                         className,
                         backgroundClassName,
                         title,
                         titleText
                       }: PropsWithChildren<DialogProps>) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const dialog = ref.current

    if (!dialog) {
      console.error('dialog open, but no ref found')
      return
    }

    overlayStack.push(dialog)

    const focusable = dialog?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      const isTopmost = overlayStack[overlayStack.length - 1] === dialog
      if (!isTopmost) return

      if (e.key === 'Escape') {
        e.stopPropagation()
      } else if (e.key === 'Tab') {
        if (focusable.length === 0) return

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus()
        }
      }
    }

    dialog.focus()
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      overlayStack = overlayStack.filter(m => m !== dialog)
    }
  }, [isOpen])

  return (
    <Overlay
      isOpen={isOpen}
      backgroundClassName={backgroundClassName}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={clsx(
          'fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 col p-4 bg-overlay-background text-overlay-text rounded-xl shadow-xl',
          className
        )}
        role="dialog"
        aria-modal={true}
      >
        {title ?? (
          <h2
            className={clsx('textstyle-title-lg')}
          >
            {titleText}
          </h2>
        )}
        {children}
      </div>
    </Overlay>
  )
}