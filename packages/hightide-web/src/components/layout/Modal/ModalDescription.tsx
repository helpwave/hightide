'use client'

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { useModalContext } from './ModalContext'

export type ModalDescriptionProps = HTMLAttributes<HTMLDivElement>

export const ModalDescription = forwardRef<HTMLDivElement, ModalDescriptionProps>(function ModalDescription({
  children,
  ...props
}, ref) {
  const context = useModalContext()
  if (!children) return null

  return (
    <div
      {...props}
      ref={ref}
      id={context.ids.description}
      className={clsx('text-description', props.className)}
    >
      {children}
    </div>
  )
})
