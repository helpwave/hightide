import type { HTMLAttributes } from 'react'

export type ChatDateDividerProps = HTMLAttributes<HTMLDivElement>

export const ChatDateDivider = ({
  children,
  ...props
}: ChatDateDividerProps) => {
  return (
    <div {...props} data-name="chat-date-divider">
      {children}
    </div>
  )
}
