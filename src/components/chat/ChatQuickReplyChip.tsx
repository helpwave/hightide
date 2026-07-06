import type { ButtonHTMLAttributes } from 'react'
import { PropsUtil } from '@/src/utils/propsUtil'

export type ChatQuickReplyChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean,
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  ...props
}: ChatQuickReplyChipProps) => {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      data-name="chat-quick-reply-chip"
      data-active={PropsUtil.dataAttributes.bool(isActive)}
    >
      {children}
    </button>
  )
}
