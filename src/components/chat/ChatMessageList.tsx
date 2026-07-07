import type { HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export type ChatMessageListProps = HTMLAttributes<HTMLDivElement> & {
  autoScroll?: boolean,
}

export const ChatMessageList = ({
  autoScroll = true,
  children,
  ...props
}: ChatMessageListProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [autoScroll, children])

  return (
    <div {...props} ref={ref} className={clsx('chat-message-list', props.className)}>
      {children}
    </div>
  )
}
