import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Icon, type IconSize } from './Icon'
import type { HTMLAttributes } from 'react'

export type ExpansionIconProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded: boolean,
  disabled?: boolean,
  size?: IconSize,
}

export const ExpansionIcon = ({
  children,
  isExpanded,
  disabled = false,
  size = 'xs',
  ...props
}: ExpansionIconProps) => {

  return (
    <div
      {...props}
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={clsx('expansion-icon', props.className)}
    >
      {children ? (
        children
      ) : (
        <Icon
          icon={ChevronDown}
          size={size}
          aria-hidden={true}
        />
      )}
    </div>
  )
}