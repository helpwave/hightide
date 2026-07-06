import type { HTMLAttributes, ReactNode } from 'react'
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
      data-name="chat-message-card"
      data-direction={direction}
      data-color={color ?? undefined}
    >
      <div data-name="chat-message-card-header">
        {icon && (
          <span data-name="chat-message-card-icon" data-color={color ?? undefined}>
            {icon}
          </span>
        )}
        <span data-name="chat-message-card-heading">
          <span data-name="chat-message-card-title" data-color={color ?? undefined}>{title}</span>
          {subtitle && (
            <span data-name="chat-message-card-subtitle">{subtitle}</span>
          )}
        </span>
        {badge && (
          <span data-name="chat-message-card-badge">{badge}</span>
        )}
      </div>
      {children && (
        <div data-name="chat-message-card-body">{children}</div>
      )}
      {actions && (
        <div data-name="chat-message-card-actions">{actions}</div>
      )}
    </div>
  )
}
