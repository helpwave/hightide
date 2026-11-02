import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { Children, forwardRef } from 'react'

export type ChatMessageComposerActionLayoutProps = HTMLAttributes<HTMLDivElement>

export const ChatMessageComposerActionLayout = forwardRef<HTMLDivElement, ChatMessageComposerActionLayoutProps>(
  function ChatMessageComposerActionLayout({ children, ...props }, forwardedRef) {
    if (Children.count(children) === 0) {
      return null
    }

    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('chat-message-composer-actions', props.className)}
      >
        {children}
      </div>
    )
  }
)
