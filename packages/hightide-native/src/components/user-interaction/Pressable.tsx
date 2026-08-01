import {
  forwardRef,
  type ReactNode
} from 'react'
import {
  Pressable as RNPressable,
  StyleSheet,
  View,
  type PressableProps as RNPressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'

export type ColorTokenPair = {
  color: ColorToken,
  onColor: ColorToken,
}

export type PressableVisualAlignment = {
  alignItems?: ViewStyle['alignItems'],
  justifyContent?: ViewStyle['justifyContent'],
}

export type PressableProps = Omit<
  RNPressableProps,
  'children' | 'style' | 'android_ripple'
> & {
  children?: ReactNode,
  /**
   * Layout of the interaction target.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>),
  /**
   * Visual surface: background, border, radius, padding, etc.
   */
  surfaceStyle?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>),
  touchTarget?: number,
  colors: ColorTokenPair,
  visualAlignment?: PressableVisualAlignment,
}

const DEFAULT_TOUCH_TARGET = 44
const PRESSED_OVERLAY_OPACITY = 0.12

export const Pressable = forwardRef<
  React.ComponentRef<typeof RNPressable>,
  PressableProps
>(function Pressable({
  children,
  style,
  surfaceStyle,
  touchTarget = DEFAULT_TOUCH_TARGET,
  colors,
  visualAlignment,
  disabled,
  ...props
}, ref) {
  return (
    <RNPressable
      {...props}
      ref={ref}
      disabled={disabled}
      style={(state) => [
        {
          minWidth: touchTarget,
          minHeight: touchTarget,
          flexGrow: 0,
          flexShrink: 0,
          display: 'flex',
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
        },
        typeof style === 'function' ? style(state) : style,
        visualAlignment,
      ]}
    >
      {(state) => (
        <View
          style={[
            {
              position: 'relative',
              backgroundColor: colors.color,
              overflow: 'hidden',
            },
            typeof surfaceStyle === 'function' ? surfaceStyle(state) : surfaceStyle,
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.onColor,
                opacity: state.pressed
                  ? PRESSED_OVERLAY_OPACITY
                  : 0,
              },
            ]}
          />
          {children}
        </View>
      )}
    </RNPressable>
  )
})