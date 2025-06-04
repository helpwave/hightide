import type { LabelHTMLAttributes } from 'react'
import clsx from 'clsx'

export type LabelType = 'labelSmall' | 'labelMedium' | 'labelBig'

const styleMapping: Record<LabelType, string> = {
  labelSmall: 'textstyle-label-sm',
  labelMedium: 'textstyle-label-md',
  labelBig: 'textstyle-label-lg',
}

export type LabelProps = {
  /** The text for the label */
  name?: string,
  /** The styling for the label */
  labelType?: LabelType,
} & LabelHTMLAttributes<HTMLLabelElement>

/**
 * A Label component
 */
export const Label = ({
                        children,
                        name,
                        labelType = 'labelSmall',
                        className,
                        ...props
                      }: LabelProps) => {
  return (
    <label {...props} className={clsx(styleMapping[labelType], className)}>
      {children ? children : name}
    </label>
  )
}
