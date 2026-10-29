import type { ComponentRef, ReactNode, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { FileInputContext } from './FileInputContext'
import { FileInputInput, type FileInputInputProps } from './FileInputInput'
import { FileInputLayout, type FileInputLayoutProps } from './FileInputLayout'
import { FileInputMenu, type FileInputMenuProps } from './FileInputMenu'
import { FileInputStateManager, type FileInputStateManagerProps } from './FileInputStateManager'
import { FileInputTrigger, type FileInputTriggerProps } from './FileInputTrigger'

export type FileInputProps = Omit<FileInputStateManagerProps, 'children'> & {
  children?: ReactNode,
  placeholder?: FileInputTriggerProps['placeholder'],
  maxVisualFiles?: FileInputTriggerProps['maxVisualFiles'],
  layoutRef?: Ref<ComponentRef<typeof FileInputLayout>>,
  layoutProps?: FileInputLayoutProps,
  inputRef?: Ref<ComponentRef<typeof FileInputInput>>,
  inputProps?: FileInputInputProps,
  triggerProps?: FileInputTriggerProps,
  menuProps?: Omit<FileInputMenuProps, 'children'>,
}

const FileInputComponent = ({
  children,
  placeholder,
  maxVisualFiles,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  triggerProps,
  menuProps,
  ...props
}: FileInputProps) => {
  return (
    <FileInputStateManager {...props}>
      <FileInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <FileInputInput
          {...inputProps}
          ref={ReactUtils.assingRefsBuilder([inputRef])}
        />
        <FileInputTrigger
          placeholder={placeholder}
          maxVisualFiles={maxVisualFiles}
          {...triggerProps}
        />
      </FileInputLayout>
      <FileInputMenu {...menuProps}>{children}</FileInputMenu>
    </FileInputStateManager>
  )
}

export const FileInput = Object.assign(FileInputComponent, {
  StateManager: FileInputStateManager,
  Layout: FileInputLayout,
  Input: FileInputInput,
  Trigger: FileInputTrigger,
  Menu: FileInputMenu,
  Context: FileInputContext,
  Provider: FileInputContext.Provider,
  Consumer: FileInputContext.Consumer,
})
