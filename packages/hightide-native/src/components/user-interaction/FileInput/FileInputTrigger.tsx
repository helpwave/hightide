import type { ReactNode } from 'react'
import { Fragment, useMemo, useState } from 'react'
import {
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons/types'
import type { FileInputState } from '../../../theme/types/components/fileInput'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { ThemedText } from '../../visualization-and-display/ThemedText'
import { ThemedPressable } from '../ThemedPressable'
import { useFileInputContext } from './FileInputContext'
import { splitVisibleFileInputItems } from './fileInputItem'

export type FileInputTriggerProps = {
  placeholder?: ReactNode,
  maxVisualFiles?: number,
  style?: StyleProp<ViewStyle>,
}

export const FileInputTrigger = ({
  placeholder,
  maxVisualFiles,
  style,
}: FileInputTriggerProps) => {
  const { theme } = useTheme()
  const translation = useHightideTranslation()
  const context = useFileInputContext()
  const [isPressed, setIsPressed] = useState(false)
  const interactive = !context.disabled && !context.readOnly
  const hasFiles = context.files.length > 0
  const { visible, hiddenCount } = splitVisibleFileInputItems(context.files, maxVisualFiles)
  const resolvedPlaceholder = placeholder ?? translation('noFilesSelected')

  const resolvedState = useMemo((): FileInputState => ({
    color: context.config.color,
    isDisabled: !!context.disabled,
    isReadonly: !!context.readOnly,
    isInvalid: !!context.invalid,
    isOpen: context.isOpen,
    hasValue: hasFiles,
    isPressed,
  }), [
    context.config.color,
    context.disabled,
    context.invalid,
    context.isOpen,
    context.readOnly,
    hasFiles,
    isPressed,
  ])

  const fileInputTheme = theme.components.fileInput
  const resolvedTriggerStyle = useMemoizedTheme(fileInputTheme.trigger, resolvedState)
  const resolvedStateLayerStyle = useMemoizedTheme(fileInputTheme.stateLayer, resolvedState)
  const resolvedFilesStyle = useMemoizedTheme(fileInputTheme.files, resolvedState)
  const resolvedFileRowStyle = useMemoizedTheme(fileInputTheme.fileRow, resolvedState)
  const resolvedFileNameStyle = useMemoizedTheme(fileInputTheme.fileName, resolvedState)
  const resolvedPlaceholderStyle = useMemoizedTheme(fileInputTheme.placeholder, resolvedState)
  const resolvedIcon = useMemoizedTheme<FileInputState, IconStyle>(fileInputTheme.icon, resolvedState)
  const resolvedFileIcon = useMemoizedTheme<FileInputState, IconStyle>(fileInputTheme.fileIcon, resolvedState)

  return (
    <ThemedPressable
      disabled={!interactive}
      style={[resolvedTriggerStyle, style]}
      accessibilityRole="button"
      accessibilityState={{
        disabled: !interactive,
        expanded: (context.maxFiles ?? 1) > 1 ? context.isOpen : undefined,
      }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => context.toggleIsOpen()}
    >
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      <View style={resolvedFilesStyle}>
        {hasFiles ? (
          <Fragment>
            {visible.map((file) => (
              <View key={file.id} style={resolvedFileRowStyle}>
                <ThemedIcon
                  icon={HightideIconRegistry.FileText}
                  size={resolvedFileIcon.size}
                  strokeWidth={resolvedFileIcon.strokeWidth}
                  color={resolvedFileIcon.color}
                />
                <ThemedText
                  style={resolvedFileNameStyle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {file.name}
                </ThemedText>
              </View>
            ))}
            {hiddenCount > 0 && (
              <ThemedText
                style={resolvedPlaceholderStyle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {translation('nMoreFiles', { count: hiddenCount })}
              </ThemedText>
            )}
          </Fragment>
        ) : typeof resolvedPlaceholder === 'string' || typeof resolvedPlaceholder === 'number' ? (
          <ThemedText style={resolvedPlaceholderStyle}>
            {resolvedPlaceholder}
          </ThemedText>
        ) : (
          resolvedPlaceholder
        )}
      </View>
      <ThemedIcon
        icon={hasFiles ? HightideIconRegistry.Pencil : HightideIconRegistry.Plus}
        size={resolvedIcon.size}
        strokeWidth={resolvedIcon.strokeWidth}
        color={resolvedIcon.color}
      />
    </ThemedPressable>
  )
}
