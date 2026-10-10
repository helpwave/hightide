'use client'

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { Visibility } from '../Visibility'
import { useModalContext } from './ModalContext'

export type ModalDescriptionProps = HTMLAttributes<HTMLDivElement>

export function ModalDescription({
  children,
  ...props
}: ModalDescriptionProps) {
  const context = useModalContext()
  if (!context.ids) {
    throw new Error('Modal.Description must be used within a Modal.Container')
  }

  return (
    <Visibility isVisible={!!children}>
      <div
        {...props}
        id={context.ids.description}
        className={clsx('text-description', props.className)}
      >
        {children}
      </div>
    </Visibility>
  )
}
