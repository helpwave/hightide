import type { MultiSelectRootProps } from './SelectContext'
import { MultiSelectRoot } from './SelectContext'
import type { MultiSelectContentProps, MultiSelectButtonProps } from './SelectComponents'
import { MultiSelectButton, MultiSelectContent } from './SelectComponents'
import { forwardRef } from 'react'

//
// MultiSelect
//
export type MultiSelectProps = MultiSelectRootProps & {
    contentPanelProps?: MultiSelectContentProps,
    buttonProps?: MultiSelectButtonProps,
  }

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect({
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
