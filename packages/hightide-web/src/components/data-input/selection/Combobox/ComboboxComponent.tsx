import type React from 'react'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComboboxInputProps } from './ComboboxInput'
import { ComboboxInput } from './ComboboxInput'
import type { ComboboxListProps } from './ComboboxList'
import { ComboboxList } from './ComboboxList'
import type { ComboboxStateManagerProps } from './ComboboxStateManager'
import { ComboboxStateManager } from './ComboboxStateManager'

export type ComboboxProps<T = string> = Omit<ComboboxStateManagerProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: ComboboxInputProps['placeholder'],
  id?: string,
  inputProps?: ComboboxInputProps,
  listProps?: Omit<ComboboxListProps, 'children'>,
}

type ComboboxComponentType = <T = string>(
  props: ComboboxProps<T> & {
    ref?: React.ForwardedRef<HTMLInputElement>,
  }
) => React.ReactElement

const ComboboxComponentImpl = forwardRef<HTMLInputElement, ComboboxProps<unknown>>(function ComboboxComponent<T>(
  {
    children,
    placeholder,
    id,
    inputProps,
    listProps,
    ...props
  }: ComboboxProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <ComboboxStateManager<T> {...props}>
      <ComboboxInput
        ref={ref}
        id={id}
        placeholder={placeholder}
        {...inputProps}
      />
      <ComboboxList {...listProps}>{children}</ComboboxList>
    </ComboboxStateManager>
  )
})

export const ComboboxComponent = ComboboxComponentImpl as ComboboxComponentType
