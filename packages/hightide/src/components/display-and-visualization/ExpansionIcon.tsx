import { ChevronDown } from 'lucide-react'
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
      data-name={props['data-name'] ?? 'expansion-icon'}
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