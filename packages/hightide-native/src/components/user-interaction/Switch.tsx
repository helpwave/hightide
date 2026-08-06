import {
  useCallback,
  useEffect,
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

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
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

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: false,
    }).start()
  }, [progress, value])

  const resolveState = (interaction: PressableInteraction): SwitchState => ({
    isActive: value,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
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
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.switch.container(state, containerStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const inactiveState: SwitchState = { ...state, isActive: false }
        const activeState: SwitchState = { ...state, isActive: true }
        const resolvedTrackStyle = theme.components.switch.track(state, trackStyle)
        const resolvedThumbInactive = theme.components.switch.thumb(inactiveState, thumbStyle)
        const resolvedThumbActive = theme.components.switch.thumb(activeState, thumbStyle)
        const trackWidth = toNumber(resolvedTrackStyle.width as string | number | undefined, 40)
        const trackHeight = toNumber(resolvedTrackStyle.height as string | number | undefined, 28)
        const trackBorderWidth = toNumber(resolvedTrackStyle.borderWidth, 0)
        const thumbInactiveSize = toNumber(resolvedThumbInactive.width as string | number | undefined, 16)
        const thumbActiveSize = toNumber(resolvedThumbActive.width as string | number | undefined, 20)
        const trackInnerWidth = trackWidth - (trackBorderWidth * 2)
        const trackInnerHeight = trackHeight - (trackBorderWidth * 2)
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
        )
      }}
    </Pressable>
  )
}
