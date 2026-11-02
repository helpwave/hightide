import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Icon } from './Icon'
import type { HTMLAttributes } from 'react'

export type ExpansionIconProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded: boolean,
  disabled?: boolean,
}

export const ExpansionIcon = ({
  children,
  isExpanded,
  disabled = false,
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
          size="xs"
          aria-hidden={true}
        />
      )}
    </div>
  )
}