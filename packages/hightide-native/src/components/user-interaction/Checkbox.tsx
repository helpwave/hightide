import { useControlledState, useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'
import { Check, Minus } from 'lucide-react-native'
import { useCallback, useMemo } from 'react'
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { Icon } from '../../icons/Icon'
import { useTheme } from '../../global-contexts/theme'
import type { CheckboxSize, CheckboxState, CheckboxStyle, StyleOverwrite } from '../../theme'
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
    checkboxStyle?: StyleOverwrite<CheckboxState, CheckboxStyle>,
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

  const state = useMemo((): CheckboxState => ({
    size,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isRounded,
    alwaysShowCheckIcon,
  }), [alwaysShowCheckIcon, disabled, indeterminate, invalid, isRounded, size, value])

  const resolvedCheckboxStyle = useMemo(
    () => theme.components.checkbox.checkbox(state, checkboxStyle),
    [theme, state, checkboxStyle]
  )
  const resolvedIcon = useMemo(
    () => theme.components.checkbox.icon(state),
    [theme, state]
  )

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
      style={[resolvedCheckboxStyle, style]}
    >
      {resolvedIcon.visible && (
        indeterminate
          ? <Icon icon={Minus} size={resolvedIcon.size} color={resolvedIcon.color} />
          : <Icon icon={Check} size={resolvedIcon.size} color={resolvedIcon.color} />
      )}
    </Pressable>
  )
}
