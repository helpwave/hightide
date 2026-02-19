import type { MultiSelectRootProps } from './SelectContext'
import { MultiSelectRoot } from './SelectContext'
import type { MultiSelectButtonProps } from './SelectButton'
import { MultiSelectButton } from './SelectButton'
import { type MultiSelectContentProps, MultiSelectContent } from './SelectContent'
import { forwardRef } from 'react'

//
// MultiSelect
//
export interface MultiSelectProps extends MultiSelectRootProps {
  contentPanelProps?: MultiSelectContentProps,
  buttonProps?: MultiSelectButtonProps,
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect({
  children,
  contentPanelProps,
  buttonProps,
  ...props
}, ref) {
  return (
    <MultiSelectRoot {...props}>
      <MultiSelectButton ref={ref} {...buttonProps} />
      <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
    </MultiSelectRoot>
  )
})
