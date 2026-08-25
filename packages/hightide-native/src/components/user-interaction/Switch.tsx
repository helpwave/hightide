import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

const ANIMATION_DURATION_MS = 250

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

const toNumber = (value: string | number | undefined, fallback: number): number => (
  typeof value === 'number' ? value : fallback
)

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

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start()
  }, [progress, value])

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

  const inactiveState = useMemo((): SwitchState => ({ ...resolvedState, isActive: false }), [resolvedState])
  const activeState = useMemo((): SwitchState => ({ ...resolvedState, isActive: true }), [resolvedState])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.switch.container, resolvedState, containerStyle)
  const resolvedTrackStyle = useMemoizedTheme(theme.components.switch.track, resolvedState, trackStyle)
  const resolvedThumbInactive = useMemoizedTheme(theme.components.switch.thumb, inactiveState, thumbStyle)
  const resolvedThumbActive = useMemoizedTheme(theme.components.switch.thumb, activeState, thumbStyle)

  const trackWidth = toNumber(resolvedTrackStyle.width as string | number | undefined, 40)
  const trackHeight = toNumber(resolvedTrackStyle.height as string | number | undefined, 28)
  const fallbackBorderWidth = toNumber(resolvedTrackStyle.borderWidth, 0)
  const trackBorderTop = toNumber(resolvedTrackStyle.borderTopWidth, fallbackBorderWidth)
  const trackBorderRight = toNumber(resolvedTrackStyle.borderRightWidth, fallbackBorderWidth)
  const trackBorderBottom = toNumber(resolvedTrackStyle.borderBottomWidth, fallbackBorderWidth)
  const trackBorderLeft = toNumber(resolvedTrackStyle.borderLeftWidth, fallbackBorderWidth)
  const thumbInactiveSize = toNumber(resolvedThumbInactive.width as string | number | undefined, 16)
  const thumbActiveSize = toNumber(resolvedThumbActive.width as string | number | undefined, 20)
  const trackInnerWidth = trackWidth - trackBorderLeft - trackBorderRight
  const trackInnerHeight = trackHeight - trackBorderTop - trackBorderBottom
  const thumbOffsetInactive = (trackInnerHeight - thumbInactiveSize) / 2
  const thumbOffsetActive = trackInnerWidth - thumbActiveSize - (
    (trackInnerHeight - thumbActiveSize) / 2
  )
  const thumbTopInactive = (trackInnerHeight - thumbInactiveSize) / 2
  const thumbTopActive = (trackInnerHeight - thumbActiveSize) / 2
  const thumbSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbInactiveSize, thumbActiveSize],
  })
  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbOffsetInactive, thumbOffsetActive],
  })
  const thumbTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbTopInactive, thumbTopActive],
  })
  const thumbColor = value
    ? resolvedThumbActive.backgroundColor
    : resolvedThumbInactive.backgroundColor

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
        <Animated.View
          style={{
            position: 'absolute',
            top: thumbTop,
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbActiveSize / 2,
            backgroundColor: thumbColor,
            transform: [{ translateX: thumbTranslateX }],
          }}
        />
      </View>
    </Pressable>
  )
}
