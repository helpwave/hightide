import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  direction?: DividerDirection,
}

export function Divider({
  direction = 'horizontal',
  className,
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      role="separator"
      className={clsx('divider', className)}
      data-direction={direction}
    />
  )
}
