import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

import { Avatar } from '../../visualization/Avatar/Avatar'
import type { AvatarProps } from '../../visualization/Avatar/AvatarComponent'

export type ChatThreadHeaderProps = HTMLAttributes<HTMLDivElement> & {
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  leadingActionsClassName?: string,
  trailingActionsClassName?: string,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leftActions,
  rightActions,
  leadingActionsClassName,
  trailingActionsClassName,
  ...props
}: ChatThreadHeaderProps) => {
  return (
    <div {...props} className={clsx('chat-thread-header', props.className)}>
      {leftActions && (
        <div className={clsx('chat-thread-header-leading', leadingActionsClassName)}>
          {leftActions}
        </div>
      )}
      <Avatar
        size="lg"
        {...avatar}
      />
      <span className="chat-thread-header-info">
        <span className="chat-thread-header-title">{title}</span>
        {subtitle && (
          <span className="chat-thread-header-subtitle">{subtitle}</span>
        )}
      </span>
      {rightActions && (
        <div className={clsx('chat-thread-header-trailing', trailingActionsClassName)}>
          {rightActions}
        </div>
      )}
    </div>
  )
}
