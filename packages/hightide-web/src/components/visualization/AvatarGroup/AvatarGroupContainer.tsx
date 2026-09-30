import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import type { AvatarSize } from '../Avatar/AvatarTypes'

export type AvatarGroupContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize,
}

export function AvatarGroupContainer({
  size = 'md',
  className,
  ...props
}: AvatarGroupContainerProps) {
  return (
    <div
      {...props}
      className={clsx('avatar-group', className)}
      data-size={size ?? undefined}
    />
  )
}
