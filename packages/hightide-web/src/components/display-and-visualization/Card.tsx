import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type CardSize = 'sm' | 'md' | 'lg'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  size?: CardSize,
}

export function Card({
  size = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={clsx('card', className)}
      data-size={size}
    />
  )
}
