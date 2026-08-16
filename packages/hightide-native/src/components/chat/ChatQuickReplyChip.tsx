import {
  useMemo,
  type ReactNode
} from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import {
  ThemedPressable,
  type ThemedPressableProps
} from '../user-interaction/ThemedPressable'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ChatQuickReplyChipState,
  PressableContainerStyle,
  PressableState,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatQuickReplyChipProps = Omit<
  ThemedPressableProps,
  'children' | 'containerStyle' | 'textStyle' | 'stateLayerStyle'
> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
  textStyle?: StyleOverwrite<PressableState, PressableTextStyle>,
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  containerStyle,
  textStyle,
  ...props
}: ChatQuickReplyChipProps) => {
  const { theme } = useTheme()
  const state = useMemo((): ChatQuickReplyChipState => ({ isActive }), [isActive])
  const pressableResolvers = useMemo(
    () => theme.components.chat.quickReplyChip.pressable(state),
    [theme, state]
  )

  return (
    <ThemedPressable
      {...props}
      disabled={disabled}
      style={style}
      containerStyle={(_, pressableState) => (
        pressableResolvers.container(pressableState, containerStyle)
      )}
      stateLayerStyle={(_, pressableState) => (
        pressableResolvers.stateLayer(pressableState)
      )}
      textStyle={(_, pressableState) => (
        pressableResolvers.text(pressableState, textStyle)
      )}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText>{children}</ThemedText>
      ) : (
        children
      )}
    </ThemedPressable>
  )
}
