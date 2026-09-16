import type { ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import type { FileInputRootProps } from './FileInputRoot'
import { FileInputRoot } from './FileInputRoot'
import type { FileInputTriggerProps } from './FileInputTrigger'
import { FileInputTrigger } from './FileInputTrigger'
import { FileInputMenu } from './FileInputMenu'

export type FileInputProps = Omit<FileInputRootProps, 'children'> & {
  placeholder?: FileInputTriggerProps['placeholder'],
  maxVisualFiles?: FileInputTriggerProps['maxVisualFiles'],
  triggerProps?: FileInputTriggerProps,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const FileInputComponent = ({
  placeholder,
  maxVisualFiles,
  triggerProps,
  children,
  style,
  ...props
}: FileInputProps) => {
  return (
    <FileInputRoot {...props}>
      <View style={style}>
        <FileInputTrigger
          placeholder={placeholder}
          maxVisualFiles={maxVisualFiles}
          {...triggerProps}
        />
        <FileInputMenu />
        {children}
      </View>
    </FileInputRoot>
  )
}
