import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import { ColoringUtils } from '../interaction'

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
      {...ColoringUtils.build({ color: 'surface' })}
      data-size={size}
      {...props}
      className={clsx('card', className)}
    />
  )
}
