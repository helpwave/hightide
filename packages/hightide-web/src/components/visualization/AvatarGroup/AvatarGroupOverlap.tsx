import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function AvatarGroupOverlap({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx('avatar-group-overlap', className)}
    />
  )
}
