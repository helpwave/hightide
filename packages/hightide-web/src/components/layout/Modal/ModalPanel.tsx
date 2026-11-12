'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { FocusTrap } from '../../interaction/FocusTrap'
import { useModalContext } from './ModalContext'

export type ModalPosition = 'top' | 'center' | 'none'

export type ModalPanelProps = HTMLAttributes<HTMLDivElement> & {
  [key: `data-${string}`]: string | undefined,
  position?: ModalPosition,
}

export const ModalPanel = forwardRef<HTMLDivElement, ModalPanelProps>(function ModalContent({
  children,
  position = 'center',
  ...props
}, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const context = useModalContext()

  return (
    <FocusTrap active={context.state.isOpen} container={context.contentRef}>
      <div
        {...props}
        id={props.id ?? context.ids.content}
        ref={ReactUtils.assingRefsBuilder([context.contentRef, forwardedRef])}
        data-state={context.transitionState}
        data-position={position}
        role="dialog"
        aria-modal={true}
        aria-labelledby={context.ids.title}
        aria-describedby={context.hasDescription ? context.ids.description : undefined}
        className={clsx('modal-panel', props.className)}
      >
        {children}
      </div>
    </FocusTrap>
  )
})
