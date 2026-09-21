import type { JSX } from 'react'
import { forwardRef, type ReactNode } from 'react'
import { ComboboxRoot } from './ComboboxRoot'
import { ComboboxInput } from './ComboboxInput'
import { ComboboxList } from './ComboboxList'
import type { ComboboxInputProps } from './ComboboxInput'
import type { ComboboxListProps } from './ComboboxList'

export interface ComboboxProps<T = string> {
  children: ReactNode,
  onItemClick?: (value: T) => void,
  id?: string,
  searchQuery?: string,
  onSearchQueryChange?: (value: string) => void,
  initialSearchQuery?: string,
  inputProps?: ComboboxInputProps,
  listProps?: ComboboxListProps,
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps<unknown>>(function Combobox<T = string> ({
  children,
  onItemClick,
  searchQuery,
  onSearchQueryChange,
  initialSearchQuery,
  inputProps,
  listProps,
}, ref) {
  return (
    <ComboboxRoot<T>
      onItemClick={onItemClick}
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      initialSearchQuery={initialSearchQuery}
    >
      <ComboboxInput ref={ref} {...inputProps} />
      <ComboboxList {...listProps}>{children}</ComboboxList>
    </ComboboxRoot>
  )
}) as <T = string>(props: ComboboxProps<T> & React.RefAttributes<HTMLDivElement>) => JSX.Element
