import type { HTMLAttributes, ReactNode } from 'react'
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
      data-name="chat-system-line"
      data-color={color ?? undefined}
    >
      <span data-name="chat-system-line-icon">
        {icon ?? <CheckCheck/>}
      </span>
      {children}
    </div>
  )
}
