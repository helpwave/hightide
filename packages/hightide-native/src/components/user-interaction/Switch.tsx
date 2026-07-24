import {
  useCallback,
  useEffect,
  useMemo,
  useRef
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

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type { SwitchState } from '../../theme/types/components/switch'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { Color } from '../../theme/types/color'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'

const TRACK_WIDTH = 48
const TRACK_HEIGHT = 28
const TRACK_BORDER_WIDTH = 2
const TRACK_PADDING = 4
const THUMB_SIZE_INACTIVE = 12
const THUMB_SIZE_ACTIVE = 16
const THUMB_OFFSET_INACTIVE = 2
const ANIMATION_DURATION_MS = 250

const TRACK_INNER_WIDTH = TRACK_WIDTH - (TRACK_BORDER_WIDTH * 2) - (TRACK_PADDING * 2)
const TRACK_INNER_HEIGHT = TRACK_HEIGHT - (TRACK_BORDER_WIDTH * 2) - (TRACK_PADDING * 2)
const THUMB_OFFSET_ACTIVE = TRACK_INNER_WIDTH - THUMB_SIZE_ACTIVE
const THUMB_TOP_INACTIVE = (TRACK_INNER_HEIGHT - THUMB_SIZE_INACTIVE) / 2
const THUMB_TOP_ACTIVE = (TRACK_INNER_HEIGHT - THUMB_SIZE_ACTIVE) / 2

export type SwitchProps = Omit<PressableProps, 'children' | 'style' | 'disabled'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    style?: StyleProp<ViewStyle>,
    trackColorStyle?: StyleOverwrite<SwitchState, Color>,
    borderColorStyle?: StyleOverwrite<SwitchState, Color>,
    thumbColorStyle?: StyleOverwrite<SwitchState, Color>,
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
  trackColorStyle,
  borderColorStyle,
  thumbColorStyle,
  accessibilityLabel,
  ...props
}: SwitchProps) => {
  const { theme } = useTheme()
  const interactive = !disabled && !readOnly

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

  const state = useMemo((): SwitchState => ({
    isActive: value,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadOnly: readOnly,
  }), [disabled, invalid, readOnly, value])

  const trackColor = useMemo(
    () => theme.components.switch.trackColor(state, trackColorStyle),
    [theme, state, trackColorStyle]
  )
  const borderColor = useMemo(
    () => theme.components.switch.borderColor(state, borderColorStyle),
    [theme, state, borderColorStyle]
  )
  const thumbColor = useMemo(
    () => theme.components.switch.thumbColor(state, thumbColorStyle),
    [theme, state, thumbColorStyle]
  )

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start()
  }, [progress, value])

  const thumbSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_SIZE_INACTIVE, THUMB_SIZE_ACTIVE],
  })
  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFFSET_INACTIVE, THUMB_OFFSET_ACTIVE],
  })
  const thumbTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_TOP_INACTIVE, THUMB_TOP_ACTIVE],
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
      onPress={(event) => {
        if (interactive) {
          setValue((previous) => !previous)
        }
        props.onPress?.(event)
      }}
      style={style}
    >
      <View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          borderWidth: TRACK_BORDER_WIDTH,
          borderColor,
          backgroundColor: trackColor,
          padding: TRACK_PADDING,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: thumbTop,
              width: thumbSize,
              height: thumbSize,
              borderRadius: THUMB_SIZE_ACTIVE / 2,
              backgroundColor: thumbColor,
              transform: [{ translateX: thumbTranslateX }],
            }}
          />
        </View>
      </View>
    </Pressable>
  )
}
