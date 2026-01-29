import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export type ExpansionIconProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded: boolean,
  disabled?: boolean,
}

export const ExpansionIcon = ({
  children,
  isExpanded,
  disabled = false,
  className,
  ...props
}: ExpansionIconProps) => {

  return (
    <div
      {...props}
      className={clsx('expansion-icon', className)}
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {children ? (
        children
      ) : (
        <ChevronDown
          aria-hidden={true}
          className="size-4"
        />
      )}
    </div>
  )
}