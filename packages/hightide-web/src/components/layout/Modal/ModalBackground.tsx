'use client'

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { useModalContext } from './ModalContext'

export type ModalBackgroundProps = HTMLAttributes<HTMLDivElement>

export const ModalBackground = forwardRef<HTMLDivElement, ModalBackgroundProps>(function ModalBackground(
  props,
  ref
) {
  const context = useModalContext()

  return (
    <div
      {...props}
      ref={ref}
      id={context.ids.background}
      onClick={context.close}
      data-state={context.transitionState}
      aria-hidden={true}
      className={clsx('modal-background', props.className)}
    />
  )
})
