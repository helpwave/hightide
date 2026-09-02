import type React from 'react'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { SelectRootProps } from './SelectRoot'
import { SelectRoot } from './SelectRoot'
import type { SelectTriggerProps } from './SelectTrigger'
import { SelectTrigger } from './SelectTrigger'
import type { SelectContentProps } from './SelectContent'
import { SelectContent } from './SelectContent'

export type SelectProps<T = string> = Omit<SelectRootProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: SelectTriggerProps<T>['placeholder'],
  selectedDisplay?: SelectTriggerProps<T>['selectedDisplay'],
  triggerProps?: SelectTriggerProps<T>,
  contentProps?: Omit<SelectContentProps, 'children'>,
}

type SelectComponentType = <T = string>(
  props: SelectProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>,
  }
) => React.ReactElement | null

const SelectComponentImpl = forwardRef<
  HTMLDivElement,
  SelectProps<unknown>
>(function SelectComponent<T>(
  {
    children,
    placeholder,
    selectedDisplay,
    triggerProps,
    contentProps,
    ...props
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SelectRoot<T> {...props}>
      <SelectTrigger
        ref={ref}
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
      />
      <SelectContent {...contentProps}>{children}</SelectContent>
    </SelectRoot>
  )
})

export const SelectComponent = SelectComponentImpl as SelectComponentType
