import clsx from 'clsx'
import type { LabelHTMLAttributes } from 'react'

export type LabelType = 'md' | 'lg'

const styleMapping: Record<LabelType, string> = {
  md: 'typography-label-md color-label-text',
  lg: 'typography-label-lg color-label-text',
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
