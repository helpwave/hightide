import {
  useCallback
} from 'react'
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

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  CheckboxSize,
  CheckboxState,
  CheckboxStyle,
  CheckboxVisualContainerStyle
} from '../../theme/types/components/checkbox'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'

export type CheckboxProps = Omit<PressableProps, 'children' | 'style'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    indeterminate?: boolean,
    size?: CheckboxSize,
    isRounded?: boolean,
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleOverwrite<CheckboxState, CheckboxStyle>,
    visualContainerStyle?: StyleOverwrite<CheckboxState, CheckboxVisualContainerStyle>,
  }

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
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
  style,
  containerStyle,
  visualContainerStyle,
  ...props
}: CheckboxProps) => {
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

  const resolveState = (interaction: PressableInteraction): CheckboxState => ({
    size,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isRounded,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
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
      onPress={(event) => {
        if (interactive) {
          setValue((previous) => !previous)
        }
        props.onPress?.(event)
      }}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.checkbox.container(state, containerStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedVisualContainerStyle = theme.components.checkbox.visualContainer(
          state,
          visualContainerStyle
        )
        const resolvedIcon = theme.components.checkbox.icon(state)
        const showIcon = !!(indeterminate || value)

        return (
          <View style={resolvedVisualContainerStyle}>
            {showIcon && (
              <ThemedIcon
                icon={indeterminate ? HightideIconRegistry.Minus : HightideIconRegistry.Check}
                size={resolvedIcon.size}
                color={resolvedIcon.color}
              />
            )}
          </View>
        )
      }}
    </Pressable>
  )
}
