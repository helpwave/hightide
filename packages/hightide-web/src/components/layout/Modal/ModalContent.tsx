import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export type ModalContentProps = HTMLAttributes<HTMLDivElement>

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(function ModalContent({
  children,
  className,
  ...props
}: ModalContentProps, ref) {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx('modal-content', className)}
    >
      {children}
    </div>
  )
})
