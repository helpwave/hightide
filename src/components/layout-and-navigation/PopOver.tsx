import type { HTMLProps } from 'react'
import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { createPortal } from 'react-dom'

export type PopOverProps = HTMLProps<HTMLDivElement>

export const PopOver = forwardRef<HTMLDivElement, PopOverProps>(function PopOver({
                                                                                   children,
                                                                                   style,
                                                                                   className,
                                                                                   ...props
                                                                                 }, ref) {
  return createPortal((
    <div
      {...props}
      ref={ref}
      className={clsx('rounded-lg shadow-around-md ', className)}
      style={{
        position: 'absolute',
        ...style
      }}
    >
      {children}
    </div>
  ), document.body)
})
