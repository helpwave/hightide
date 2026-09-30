import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function AvatarGroupAdditionalText({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={clsx('avatar-group-additional-text', className)}
    />
  )
}
