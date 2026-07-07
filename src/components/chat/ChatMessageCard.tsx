import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import type { ChatMessageDirection } from './ChatMessageBubble'
import type { ChipColor } from '../display-and-visualization/Chip'

export type ChatMessageCardProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode,
  title: ReactNode,
  subtitle?: ReactNode,
  badge?: ReactNode,
  actions?: ReactNode,
  color?: ChipColor,
  direction?: ChatMessageDirection,
}

export const ChatMessageCard = ({
  icon,
  title,
  subtitle,
  badge,
  actions,
  color = 'primary',
  direction = 'incoming',
  children,
  ...props
}: ChatMessageCardProps) => {
  return (
    <div
      {...props}
      className={clsx('chat-message-card', props.className)}
      data-direction={direction}
      data-color={color ?? undefined}
    >
      <div className="chat-message-card-header">
        {icon && (
          <span className="chat-message-card-icon" data-color={color ?? undefined}>
            {icon}
          </span>
        )}
        <span className="chat-message-card-heading">
          <span className="chat-message-card-title" data-color={color ?? undefined}>{title}</span>
          {subtitle && (
            <span className="chat-message-card-subtitle">{subtitle}</span>
          )}
        </span>
        {badge && (
          <span className="chat-message-card-badge">{badge}</span>
        )}
      </div>
      {children && (
        <div className="chat-message-card-body">{children}</div>
      )}
      {actions && (
        <div className="chat-message-card-actions">{actions}</div>
      )}
    </div>
  )
}
