import type { ReactNode } from 'react'
import {
  forwardRef
} from 'react'
import type { SelectRootProps } from './SelectContext'
import { SelectRoot } from './SelectContext'
import type { SelectButtonProps, SelectContentProps } from './SelectComponents'
import { SelectButton } from './SelectComponents'
import { SelectContent } from './SelectComponents'

//
// Select
//
export type SelectProps = SelectRootProps & {
  contentPanelProps?: SelectContentProps,
  buttonProps?: Omit<SelectButtonProps, 'selectedDisplay'> & { selectedDisplay?: (value: string) => ReactNode },
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
  children,
  contentPanelProps,
  buttonProps,
  ...props
}, ref) {
  return (
    <SelectRoot {...props}>
      <SelectButton
        ref={ref}
        {...buttonProps}
        selectedDisplay={values => {
          const value = values[0]
          if (!buttonProps?.selectedDisplay) return undefined
          return buttonProps.selectedDisplay(value)
        }}
      />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})
