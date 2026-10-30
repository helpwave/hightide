import type { ReactNode, Ref } from 'react'
import type { SelectStateManagerProps } from './SelectStateManager'
import { SelectStateManager } from './SelectStateManager'
import type { SelectTriggerProps } from './SelectTrigger'
import { SelectTrigger } from './SelectTrigger'
import type { SelectContentProps } from './SelectContent'
import { SelectContent } from './SelectContent'

export type SelectProps<T = string> = Omit<SelectStateManagerProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: SelectTriggerProps<T>['placeholder'],
  selectedDisplay?: SelectTriggerProps<T>['selectedDisplay'],
  triggerRef?: Ref<HTMLDivElement>,
  triggerProps?: SelectTriggerProps<T>,
  contentProps?: Omit<SelectContentProps, 'children'>,
}

export function SelectComponent<T = string>({
  children,
  placeholder,
  selectedDisplay,
  triggerRef,
  triggerProps,
  contentProps,
  ...props
}: SelectProps<T>) {
  return (
    <SelectStateManager<T> {...props}>
      <SelectTrigger
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
        ref={triggerRef}
      />
      <SelectContent {...contentProps}>{children}</SelectContent>
    </SelectStateManager>
  )
}
