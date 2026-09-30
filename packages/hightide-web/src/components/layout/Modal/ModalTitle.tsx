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
      className={clsx('typography-title-lg mr-10', props.className)}
    >
      {children}
    </div>
  )
}
