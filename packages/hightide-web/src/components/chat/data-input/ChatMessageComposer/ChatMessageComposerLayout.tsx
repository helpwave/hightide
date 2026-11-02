import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ChatMessageComposerLayoutProps = HTMLAttributes<HTMLDivElement>

export const ChatMessageComposerLayout = forwardRef<HTMLDivElement, ChatMessageComposerLayoutProps>(
  function ChatMessageComposerLayout(props, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('chat-message-composer', props.className)}
      />
    )
  }
)
