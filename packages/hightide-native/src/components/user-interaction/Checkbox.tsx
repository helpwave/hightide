import { useCallback, useMemo, useState } from 'react'
import {
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

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  CheckboxSize,
  CheckboxState,
  CheckboxStateLayerStyle,
  CheckboxStyle
} from '../../theme/types/components/checkbox'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'

export type CheckboxProps = Omit<PressableProps, 'children' | 'style'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    indeterminate?: boolean,
    size?: CheckboxSize,
    isRounded?: boolean,
    color?: ColorPairToken,
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleOverwrite<CheckboxState, CheckboxStyle>,
    stateLayerStyle?: StyleOverwrite<CheckboxState, CheckboxStateLayerStyle>,
  }

export const Checkbox = ({
  value: controlledValue,
  initialValue = false,
  indeterminate,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueChange,
  onEditComplete,
  size = 'md',
  isRounded = false,
  color,
  style,
  containerStyle,
  stateLayerStyle,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}: CheckboxProps) => {
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

  const resolvedState = useMemo((): CheckboxState => ({
    size,
    color,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isRounded,
    isPressed,
  }), [
    size,
    color,
    value,
    indeterminate,
    invalid,
    disabled,
    readOnly,
    isRounded,
    isPressed,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.checkbox.container, resolvedState, containerStyle)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.checkbox.stateLayer, resolvedState, stateLayerStyle)
  const resolvedIcon = useMemoizedTheme(theme.components.checkbox.icon, resolvedState)
  const showIcon = !!(indeterminate || value)

  return (
    <Pressable
      {...props}
      disabled={!interactive}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : value,
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
      <View
        pointerEvents="none"
        style={resolvedStateLayerStyle}
      />
      {showIcon && (
        <ThemedIcon
          icon={indeterminate ? HightideIconRegistry.Minus : HightideIconRegistry.Check}
          size={resolvedIcon.size}
          color={resolvedIcon.color}
        />
      )}
    </Pressable>
  )
}
