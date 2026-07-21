import { useControlledState, useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'
import { Check, Minus } from 'lucide-react-native'
import { useCallback } from 'react'
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { Icon } from '../../icons/Icon'
import { useTheme } from '../../global-contexts/theme'
import type { CheckboxSize, CheckboxState, CheckboxStyle } from '../../theme'
import type { FormFieldDataHandling, FormFieldInteractionStates } from '../../types/formField'

export type { CheckboxSize }

export type CheckboxProps = Omit<PressableProps, 'children' | 'style'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    indeterminate?: boolean,
    size?: CheckboxSize,
    alwaysShowCheckIcon?: boolean,
    isRounded?: boolean,
    style?: StyleProp<ViewStyle>,
    checkboxStyle?: StyleProp<ViewStyle> | ((style: CheckboxStyle) => StyleProp<ViewStyle>),
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
  alwaysShowCheckIcon = false,
  isRounded = false,
  style,
  checkboxStyle,
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

  const state: CheckboxState = {
    size,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isRounded,
    alwaysShowCheckIcon,
  }

  const resolvedCheckbox = theme.components.checkbox.checkbox(state)
  const resolvedIcon = theme.components.checkbox.icon(state)
  const appliedCheckboxStyle = typeof checkboxStyle === 'function'
    ? checkboxStyle(resolvedCheckbox)
    : [resolvedCheckbox, checkboxStyle]

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
      style={[appliedCheckboxStyle, style]}
    >
      {resolvedIcon.visible && (
        indeterminate
          ? <Icon icon={Minus} size={resolvedIcon.size} color={resolvedIcon.color} />
          : <Icon icon={Check} size={resolvedIcon.size} color={resolvedIcon.color} />
      )}
    </Pressable>
  )
}
