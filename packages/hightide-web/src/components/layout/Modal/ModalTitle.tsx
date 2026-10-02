'use client'

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { useModalContext } from './ModalContext'

export type ModalTitleProps = HTMLAttributes<HTMLDivElement>

export function ModalTitle({
  children,
  ...props
}: ModalTitleProps) {
  const context = useModalContext()
  if (!context.ids) {
    throw new Error('Modal.Title must be used within a Modal.Container')
  }

  return (
    <div
      {...props}
      id={context.ids.title}
      className={clsx('modal-title', props.className)}
    >
      {children}
    </div>
  )
}
