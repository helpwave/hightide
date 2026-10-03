'use client'

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { useModalContext } from './ModalContext'

export type ModalBackgroundProps = HTMLAttributes<HTMLDivElement>

export function ModalBackground({
  ...props
}: ModalBackgroundProps) {
  const context = useModalContext()
  if (!context.ids || !context.onClose || context.transitionState === undefined) {
    throw new Error('Modal.Background must be used within a Modal.Container')
  }

  return (
    <div
      {...props}
      id={context.ids.background}
      onClick={context.onClose}
      data-state={context.transitionState}
      aria-hidden={true}
      className={clsx('modal-background', props.className)}
    />
  )
}
