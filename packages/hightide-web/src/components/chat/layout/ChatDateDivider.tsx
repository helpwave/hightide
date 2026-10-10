import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type ChatDateDividerProps = HTMLAttributes<HTMLDivElement>

export const ChatDateDivider = ({
  children,
  ...props
}: ChatDateDividerProps) => {
  return (
    <div {...props} className={clsx('chat-date-divider', props.className)}>
      {children}
    </div>
  )
}
