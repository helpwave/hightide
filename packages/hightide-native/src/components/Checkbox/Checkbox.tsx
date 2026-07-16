import { remToPx, spacing } from '@helpwave/hightide-design'
import type { ElementSize } from '@helpwave/hightide-design'
import { useControlledState, useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'
import { Check, Minus } from 'lucide-react-native'
import { useCallback } from 'react'
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { Icon } from '../../icons/Icon'
import { useTheme } from '../../global-contexts/theme'
import type { FormFieldDataHandling, FormFieldInteractionStates } from '../../types/formField'

export type CheckboxSize = 'sm' | 'md' | 'lg'

const checkboxSizes: Record<CheckboxSize, number> = {
  sm: remToPx('1.25rem'),
  md: remToPx('1.5rem'),
  lg: remToPx('2rem'),
}

const checkboxIconSizes: Record<CheckboxSize, ElementSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

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
  ...props
}: CheckboxProps) => {
  const { theme: { semantic, component } } = useTheme()
  const dimension = checkboxSizes[size]
  const iconSize = checkboxIconSizes[size]
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

  const showIndicator = indeterminate || alwaysShowCheckIcon || value
  const indicatorColor = value || indeterminate ? semantic.onPrimary : semantic.primary
  const borderColor = disabled ? semantic.disabled : invalid ? semantic.negative : (value || indeterminate ? semantic.primary : component.border)
  const backgroundColor = disabled
    ? semantic.disabled
    : (value || indeterminate ? semantic.primary : component.input.background)

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
      style={[
        {
          width: dimension,
          height: dimension,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: remToPx(spacing.coloringOutlineWidth),
          borderColor,
          borderRadius: isRounded ? dimension / 2 : 6,
          backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {showIndicator && (
        indeterminate
          ? <Icon icon={Minus} size={iconSize} color={indicatorColor} />
          : <Icon icon={Check} size={iconSize} color={indicatorColor} />
      )}
    </Pressable>
  )
}
