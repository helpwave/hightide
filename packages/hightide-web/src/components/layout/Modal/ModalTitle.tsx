'use client'

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { useModalContext } from './ModalContext'

export type ModalTitleProps = HTMLAttributes<HTMLDivElement>

export const ModalTitle = forwardRef<HTMLDivElement, ModalTitleProps>(function ModalTitle({
  children,
  ...props
}, ref) {
  const context = useModalContext()

  return (
    <div
      {...props}
      ref={ref}
      id={context.ids.title}
      className={clsx('modal-title', props.className)}
    >
      {children}
    </div>
  )
})
