import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { CheckCheck } from 'lucide-react'
import type { ChipColor } from '../display-and-visualization/Chip'

export type ChatSystemLineProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode,
  color?: ChipColor,
}

export const ChatSystemLine = ({
  icon,
  color = 'primary',
  children,
  ...props
}: ChatSystemLineProps) => {
  return (
    <div
      {...props}
      className={clsx('chat-system-line', props.className)}
      data-color={color ?? undefined}
    >
      <span className="chat-system-line-icon">
        {icon ?? <CheckCheck/>}
      </span>
      {children}
    </div>
  )
}
