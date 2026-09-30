import type { ElementType, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { CheckCheck } from 'lucide-react'
import { Icon } from '../display-and-visualization/Icon'
import type { ChipColor } from '../display-and-visualization/Chip'
import { ColoringUtils } from '../../utils/coloring'

export type ChatSystemLineProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ElementType,
  color?: ChipColor,
}

export const ChatSystemLine = ({
  icon = CheckCheck,
  color = 'primary',
  children,
  ...props
}: ChatSystemLineProps) => {
  return (
    <div
      {...props}
      {...ColoringUtils.build({
        color: color ?? 'primary',
      })}
      className={clsx('chat-system-line', props.className)}
    >
      <Icon icon={icon} size="xs" className="chat-system-line-icon" />
      {children}
    </div>
  )
}
