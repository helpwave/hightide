import type { HTMLAttributes, ReactNode } from 'react'
import type { AvatarWithStatusProps } from '../display-and-visualization/Avatar'
import { AvatarWithStatus } from '../display-and-visualization/Avatar'

export type ChatThreadHeaderProps = HTMLAttributes<HTMLDivElement> & {
  avatar?: AvatarWithStatusProps,
  title: ReactNode,
  subtitle?: ReactNode,
  leading?: ReactNode,
  trailing?: ReactNode,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leading,
  trailing,
  ...props
}: ChatThreadHeaderProps) => {
  return (
    <div {...props} data-name="chat-thread-header">
      {leading}
      {avatar && (<AvatarWithStatus size="md" {...avatar}/>)}
      <span data-name="chat-thread-header-info">
        <span data-name="chat-thread-header-title">{title}</span>
        {subtitle && (
          <span data-name="chat-thread-header-subtitle">{subtitle}</span>
        )}
      </span>
      {trailing && (
        <span data-name="chat-thread-header-trailing">{trailing}</span>
      )}
    </div>
  )
}
