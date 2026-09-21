import type React from 'react'
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { FileInputRootProps } from './FileInputRoot'
import { FileInputRoot } from './FileInputRoot'
import type { FileInputTriggerProps } from './FileInputTrigger'
import { FileInputTrigger } from './FileInputTrigger'
import type { FileInputMenuProps } from './FileInputMenu'
import { FileInputMenu } from './FileInputMenu'

export type FileInputProps = Omit<FileInputRootProps, 'children'> & {
  children?: ReactNode,
  placeholder?: FileInputTriggerProps['placeholder'],
  maxVisualFiles?: FileInputTriggerProps['maxVisualFiles'],
  triggerProps?: FileInputTriggerProps,
  menuProps?: Omit<FileInputMenuProps, 'children'>,
}

type FileInputComponentType = (
  props: FileInputProps & {
    ref?: React.ForwardedRef<HTMLDivElement>,
  }
) => React.ReactElement | null

const FileInputComponentImpl = forwardRef<
  HTMLDivElement,
  FileInputProps
>(function FileInputComponent(
  {
    children,
    placeholder,
    maxVisualFiles,
    triggerProps,
    menuProps,
    ...props
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <FileInputRoot {...props}>
      <FileInputTrigger
        ref={ref}
        placeholder={placeholder}
        maxVisualFiles={maxVisualFiles}
        {...triggerProps}
      />
      <FileInputMenu {...menuProps}>{children}</FileInputMenu>
    </FileInputRoot>
  )
})

export const FileInputComponent = FileInputComponentImpl as FileInputComponentType
