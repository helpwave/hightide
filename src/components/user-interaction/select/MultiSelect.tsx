import type { MultiSelectRootProps } from './SelectContext'
import { MultiSelectRoot } from './SelectContext'
import type { MultiSelectContentProps, MultiSelectButtonProps } from './SelectComponents'
import { MultiSelectButton, MultiSelectContent } from './SelectComponents'
import { forwardRef } from 'react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

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


export const MultiSelectUncontrolled = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelectUncontrolled({
  value: initialValue,
  onValueChange,
  ...props
}, ref) {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <MultiSelect
      {...props}
      ref={ref}
      value={value}
      onValueChange={setValue}
    />
  )
})