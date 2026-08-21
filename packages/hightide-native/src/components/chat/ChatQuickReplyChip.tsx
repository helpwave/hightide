import {
  useMemo,
  type ReactNode
} from 'react'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import {
  ThemedPressable,
  type ThemedPressableProps
} from '../user-interaction/ThemedPressable'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ChatQuickReplyChipState,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatQuickReplyChipProps = Omit<
  ThemedPressableProps,
  'children' | 'containerStyle' | 'textStyle' | 'stateLayerStyle' | 'iconStyle'
> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleOverwrite<PressableState, PressableContainerStyle>,
  textStyle?: StyleOverwrite<PressableState, PressableTextStyle>,
  iconStyle?: StyleOverwrite<PressableState, PressableIconStyle>,
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  textStyle,
  iconStyle,
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
      style={(pressableState) => (
        pressableResolvers.container(pressableState, style)
      )}
      stateLayerStyle={(pressableState) => (
        pressableResolvers.stateLayer(pressableState)
      )}
      textStyle={(pressableState) => (
        pressableResolvers.text(pressableState, textStyle)
      )}
      iconStyle={(pressableState) => (
        pressableResolvers.icon(pressableState, iconStyle)
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
