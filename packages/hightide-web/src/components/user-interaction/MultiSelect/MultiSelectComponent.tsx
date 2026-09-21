import type React from 'react'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { MultiSelectRootProps } from './MultiSelectRoot'
import { MultiSelectRoot } from './MultiSelectRoot'
import type { MultiSelectTriggerProps } from './MultiSelectTrigger'
import { MultiSelectTrigger } from './MultiSelectTrigger'
import type { MultiSelectContentProps } from './MultiSelectContent'
import { MultiSelectContent } from './MultiSelectContent'

export type MultiSelectProps<T = string> = Omit<MultiSelectRootProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: MultiSelectTriggerProps<T>['placeholder'],
  selectedDisplay?: MultiSelectTriggerProps<T>['selectedDisplay'],
  triggerProps?: MultiSelectTriggerProps<T>,
  contentProps?: Omit<MultiSelectContentProps, 'children'>,
}

type MultiSelectComponentType = <T = string>(
  props: MultiSelectProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>,
  }
) => React.ReactElement | null

const MultiSelectComponentImpl = forwardRef<
  HTMLDivElement,
  MultiSelectProps<unknown>
>(function MultiSelectComponent<T>(
  {
    children,
    placeholder,
    selectedDisplay,
    triggerProps,
    contentProps,
    ...props
  }: MultiSelectProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <MultiSelectRoot<T> {...props}>
      <MultiSelectTrigger
        ref={ref}
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
      />
      <MultiSelectContent {...contentProps}>{children}</MultiSelectContent>
    </MultiSelectRoot>
  )
})

export const MultiSelectComponent = MultiSelectComponentImpl as MultiSelectComponentType
