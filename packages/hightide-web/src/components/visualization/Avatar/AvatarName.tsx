import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { isImageShown, useAvatarContext } from './AvatarContext'
import type { AvatarSize } from './AvatarTypes'

function initialsFor(name: string, size: AvatarSize) {
  const maxLetters = size === 'sm' ? 1 : 2
  return name
    .split(' ')
    .filter((_, index) => index < maxLetters)
    .map((value) => value[0])
    .join('')
    .toUpperCase()
}

export function AvatarName({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const context = useAvatarContext()
  if (!context.name || isImageShown(context)) return null

  return (
    <span
      {...props}
      className={clsx('avatar-name', className)}
    >
      {children ?? initialsFor(context.name, context.size)}
    </span>
  )
}
