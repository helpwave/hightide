import type { ReactNode, Ref } from 'react'
import type { MultiSelectStateManagerProps } from './MultiSelectStateManager'
import { MultiSelectStateManager } from './MultiSelectStateManager'
import type { MultiSelectTriggerProps } from './MultiSelectTrigger'
import { MultiSelectTrigger } from './MultiSelectTrigger'
import type { MultiSelectContentProps } from './MultiSelectContent'
import { MultiSelectContent } from './MultiSelectContent'

export type MultiSelectProps<T = string> = Omit<MultiSelectStateManagerProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: MultiSelectTriggerProps<T>['placeholder'],
  selectedDisplay?: MultiSelectTriggerProps<T>['selectedDisplay'],
  triggerRef?: Ref<HTMLDivElement>,
  triggerProps?: MultiSelectTriggerProps<T>,
  contentProps?: Omit<MultiSelectContentProps, 'children'>,
}

export function MultiSelectComponent<T = string>({
  children,
  placeholder,
  selectedDisplay,
  triggerRef,
  triggerProps,
  contentProps,
  ...props
}: MultiSelectProps<T>) {
  return (
    <MultiSelectStateManager<T> {...props}>
      <MultiSelectTrigger
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
        ref={triggerRef}
      />
      <MultiSelectContent {...contentProps}>{children}</MultiSelectContent>
    </MultiSelectStateManager>
  )
}
