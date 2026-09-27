import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { useAvatarContext } from './AvatarContext'

export function AvatarStatusIndicator({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { hasStatusIndicator, size, status } = useAvatarContext()
  if (!hasStatusIndicator) return null

  return (
    <div
      {...props}
      className={clsx('avatar-status-indicator', className)}
      data-size={size ?? undefined}
      data-status={status}
    />
  )
}
