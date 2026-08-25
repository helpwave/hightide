import {
  useCallback,
  useMemo,
  useState
} from 'react'
import {
  Animated,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import {
  useControlledState,
  useEventCallbackStabilizer
} from '@helpwave/hightide-utils/hooks'

import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useAnimatedStyleTransition } from '../../hooks/useAnimatedStyleTransition'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  SwitchContainerStyle,
  SwitchState,
  SwitchThumbStyle,
  SwitchTrackStyle
} from '../../theme/types/components/switch'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'

const thumbAnimatedAttributes: (keyof ViewStyle)[] = [
  'transform',
  'position',
  'width',
  'height',
]

export type SwitchProps = Omit<PressableProps, 'children' | 'style' | 'disabled'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleOverwrite<SwitchState, SwitchContainerStyle>,
    trackStyle?: StyleOverwrite<SwitchState, SwitchTrackStyle>,
    thumbStyle?: StyleOverwrite<SwitchState, SwitchThumbStyle>,
  }

export const Switch = ({
  value: controlledValue,
  initialValue = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueChange,
  onEditComplete,
  style,
  containerStyle,
  trackStyle,
  thumbStyle,
  accessibilityLabel,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}: SwitchProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })
  const interactive = !disabled && !readOnly
  const [isPressed, setIsPressed] = useState(false)

  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)

  const onChangeWrapper = useCallback((nextValue: boolean) => {
    onValueChangeStable(nextValue)
    onEditCompleteStable(nextValue)
  }, [onEditCompleteStable, onValueChangeStable])

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onChangeWrapper,
    defaultValue: initialValue,
  })

  const resolvedState = useMemo((): SwitchState => ({
    isActive: value,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isPressed,
  }), [
    value,
    invalid,
    disabled,
    readOnly,
    isPressed,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.switch.container, resolvedState, containerStyle)
  const resolvedTrackStyle = useMemoizedTheme(theme.components.switch.track, resolvedState, trackStyle)
  const resolvedThumbStyle = useMemoizedTheme(theme.components.switch.thumb, resolvedState, thumbStyle)
  const animatedThumbStyle = useAnimatedStyleTransition({
    style: resolvedThumbStyle,
    duration: theme.motion.durations.normal,
    animatedAttributes: thumbAnimatedAttributes,
  })

  return (
    <Pressable
      {...props}
      disabled={!interactive}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        checked: value,
        disabled,
      }}
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={[resolvedContainerStyle, style]}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
      onPress={(event) => {
        if (interactive) {
          setValue((previous) => !previous)
        }
        props.onPress?.(event)
      }}
    >
      {hitBox.isVisualizing && (
        <View
          pointerEvents="none"
          style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
        />
      )}
      <View style={resolvedTrackStyle}>
        <Animated.View style={animatedThumbStyle} />
      </View>
    </Pressable>
  )
}
