import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ListNavigationItemDescriptionStyle,
  ListNavigationItemState,
  ListNavigationItemStyle,
  ListNavigationItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'
import { ListItemAccessory } from './ListItemAccessory'
import {
  ListItemTextContent,
  type ListItemContentOrder
} from './ListItemTextContent'

export type ListNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemStyle>,
  titleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemDescriptionStyle>,
}

export const ListNavigationItem = ({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}: ListNavigationItemProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })
  const [isPressed, setIsPressed] = useState(false)

  const resolvedState = useMemo((): ListNavigationItemState => ({
    color,
    isDisabled: !!disabled,
    isPressed,
  }), [color, disabled, isPressed])

  const resolvedItemStyle = useMemoizedTheme(theme.components.listItem.navigation.container, resolvedState, itemStyle)
  const resolvedLeadingItemContainerStyle = useMemoizedTheme(theme.components.listItem.navigation.leadingItemContainer, resolvedState)
  const resolvedContentStyle = useMemoizedTheme(theme.components.listItem.navigation.content, resolvedState)
  const resolvedTrailingItemContainerStyle = useMemoizedTheme(theme.components.listItem.navigation.trailingItemContainer, resolvedState)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.listItem.navigation.titleText, resolvedState, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.listItem.navigation.descriptionText, resolvedState, subtitleStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.listItem.navigation.icon, resolvedState)

  return (
    <Pressable
      {...props}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={[resolvedItemStyle, style]}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {hitBox.isVisualizing && (
        <View
          pointerEvents="none"
          style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
        />
      )}
      {leading != null && (
        <ListItemAccessory
          style={resolvedLeadingItemContainerStyle}
          foreground={color?.onColor}
          iconStyle={resolvedIconStyle}
        >
          {leading}
        </ListItemAccessory>
      )}
      <View style={resolvedContentStyle}>
        <ListItemTextContent
          title={title}
          subtitle={subtitle}
          content={content}
          contentOrder={contentOrder}
          titleStyle={resolvedTitleStyle}
          subtitleStyle={resolvedSubtitleStyle}
        />
      </View>
      <ListItemAccessory
        style={resolvedTrailingItemContainerStyle}
        foreground={color?.onColor}
        iconStyle={resolvedIconStyle}
      >
        <ThemedIcon icon={HightideIconRegistry.ChevronRight} />
      </ListItemAccessory>
    </Pressable>
  )
}
