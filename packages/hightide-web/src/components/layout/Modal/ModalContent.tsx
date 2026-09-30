'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { FocusTrap } from '../../utils/FocusTrap'
import { useModalContext } from './ModalContext'

export type ModalPosition = 'top' | 'center' | 'none'

export type ModalContentProps = HTMLAttributes<HTMLDivElement> & {
  [key: `data-${string}`]: string | undefined,
  position?: ModalPosition,
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(function ModalContent({
  children,
  position = 'center',
  ...props
}, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const context = useModalContext()
  if (!context.ids || !context.onClose || context.transitionState === undefined || !context.contentRef || !context.contentRefAssignment) {
    throw new Error('Modal.Content must be used within a Modal.Container')
  }

  return (
    <FocusTrap active={!!context.isContentPresent && context.isOpen} container={context.contentRef}>
      <div
        {...props}
        id={props.id ?? context.ids.content}
        ref={ReactUtils.assingRefsBuilder([context.contentRefAssignment, forwardedRef])}
        data-state={context.transitionState}
        data-position={position}
        role="dialog"
        aria-modal={true}
        aria-labelledby={context.ids.title}
        aria-describedby={context.hasDescription ? context.ids.description : undefined}
        className={clsx('modal-content', props.className)}
      >
        {children}
      </div>
    </FocusTrap>
  )
})
