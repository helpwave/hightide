import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  type PressableProps
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  PressableContainerStyle,
  PressableIconStyle,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedPressable } from '../user-interaction'

export type ChatQuickReplyChipProps = Omit<PressableProps, 'children' | 'style'> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleOverwrite<PressableContainerStyle>,
  textStyle?: StyleOverwrite<PressableTextStyle>,
  iconStyle?: StyleOverwrite<PressableIconStyle>,
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  textStyle,
  ...props
}: ChatQuickReplyChipProps) => {
  const { theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const state = useMemo(() => ({
    state: new Set([
      ...(isActive ? ['active'] : []),
      ...(isPressed ? ['isPressed'] : []),
    ]),
  }), [isActive, isPressed])
  const resolvedTextStyle = useMemoizedTheme(
    theme.components.chat.quickReplyChip.text ?? theme.components.themedPressable.text,
    state,
    textStyle
  )
  const resolvedContainerStyle = useMemoizedTheme(
    theme.components.chat.quickReplyChip.container ?? theme.components.themedPressable.container,
    state,
    style
  )

  return (
    <ThemedPressable
      {...props}
      disabled={disabled}
      size="sm"
      coloringStyle="filled"
      coloringColorVariant="normal"
      style={resolvedContainerStyle}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText style={resolvedTextStyle}>{children}</ThemedText>
      ) : (
        children
      )}
    </ThemedPressable>
  )
}
