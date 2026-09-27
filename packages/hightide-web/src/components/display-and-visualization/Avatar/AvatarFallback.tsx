import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import { UserIcon } from 'lucide-react'

import { isImageShown, useAvatarContext } from './AvatarContext'

export function AvatarFallback({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const context = useAvatarContext()
  if (context.name || isImageShown(context)) return null

  return (
    <div
      {...props}
      className={clsx('avatar-fallback', className)}
    >
      <UserIcon />
    </div>
  )
}
