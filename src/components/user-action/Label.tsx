import clsx from 'clsx'
import type { LabelHTMLAttributes } from 'react'

export type LabelType = 'sm' | 'md'

const styleMapping: Record<LabelType, string> = {
  sm: 'typography-label-xs color-label-text',
  md: 'typography-label-md color-label-text',
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /** The size of the label */
  size?: LabelType,
}

/**
 * A Label component
 */
export const Label = ({
                        children,
                        size = 'md',
                        className,
                        ...props
                      }: LabelProps) => {
  return (
    <label {...props} className={clsx(styleMapping[size], className)}>
      {children}
    </label>
  )
}
