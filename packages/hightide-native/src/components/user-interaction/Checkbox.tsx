import { useCallback, useMemo } from 'react'
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
import type { PressableInteractionState } from '../../utils/pressableInteraction'

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

type CheckboxContentProps = {
  pressableState: PressableInteractionState,
  value: boolean,
  indeterminate?: boolean,
  size: CheckboxSize,
  isRounded: boolean,
  color?: ColorPairToken,
  invalid: boolean,
  disabled: boolean,
  readOnly: boolean,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleOverwrite<CheckboxState, CheckboxStyle>,
  stateLayerStyle?: StyleOverwrite<CheckboxState, CheckboxStateLayerStyle>,
  hitSlop: PressableProps['hitSlop'],
}

const CheckboxContent = ({
  pressableState,
  value,
  indeterminate,
  size,
  isRounded,
  color,
  invalid,
  disabled,
  readOnly,
  style,
  containerStyle,
  stateLayerStyle,
  hitSlop,
}: CheckboxContentProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()

  const state = useMemo((): CheckboxState => ({
    size,
    color,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isRounded,
    isPressed: pressableState.pressed,
    isHovered: !!pressableState.hovered,
    isFocused: !!pressableState.focused,
    isFocusVisible: !!pressableState.focusVisible,
  }), [
    size,
    color,
    value,
    indeterminate,
    invalid,
    disabled,
    readOnly,
    isRounded,
    pressableState.pressed,
    pressableState.hovered,
    pressableState.focused,
    pressableState.focusVisible,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.checkbox.container, state, containerStyle)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.checkbox.stateLayer, state, stateLayerStyle)
  const resolvedIcon = useMemoizedTheme(theme.components.checkbox.icon, state)
  const showIcon = !!(indeterminate || value)

  return (
    <View style={[resolvedContainerStyle, style]}>
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
    </View>
  )
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
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })
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
      onPress={(event) => {
        if (interactive) {
          setValue((previous) => !previous)
        }
        props.onPress?.(event)
      }}
    >
      {(pressableState) => (
        <CheckboxContent
          pressableState={pressableState as PressableInteractionState}
          value={value}
          indeterminate={indeterminate}
          size={size}
          isRounded={isRounded}
          color={color}
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          style={style}
          containerStyle={containerStyle}
          stateLayerStyle={stateLayerStyle}
          hitSlop={hitSlop}
        />
      )}
    </Pressable>
  )
}
