import {
  Fragment,
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

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
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

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
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
    color,
    isChecked: value,
    isIndeterminate: indeterminate,
    isInvalid: invalid,
    isDisabled: disabled,
    isReadonly: readOnly,
    isRounded,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
    isFocusVisible: !!interaction.focusVisible,
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
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.checkbox.container(state, containerStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedIcon = theme.components.checkbox.icon(state)
        const showIcon = !!(indeterminate || value)

        return (
          <Fragment>
            {hitBox.isVisualizing && (
              <View
                pointerEvents="none"
                style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
              />
            )}
            <View
              pointerEvents="none"
              style={theme.components.checkbox.stateLayer(state, stateLayerStyle)}
            />
            {showIcon && (
              <ThemedIcon
                icon={indeterminate ? HightideIconRegistry.Minus : HightideIconRegistry.Check}
                size={resolvedIcon.size}
                color={resolvedIcon.color}
              />
            )}
          </Fragment>
        )
      }}
    </Pressable>
  )
}
