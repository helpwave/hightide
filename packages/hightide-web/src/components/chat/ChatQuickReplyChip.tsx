import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '../../utils/propsUtil'

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
      className={clsx('chat-quick-reply-chip', props.className)}
      data-active={PropsUtil.dataAttributes.bool(isActive)}
    >
      {children}
    </button>
  )
}
