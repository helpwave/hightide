import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { SelectState } from '../../../theme/types/components/select'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { ThemedText } from '../../visualization-and-display/ThemedText'
import { useSelectContext, type SelectOptionType } from './SelectContext'

export type SelectTriggerProps<T = string> = {
  placeholder?: ReactNode,
  selectedDisplay?: (option: SelectOptionType<T> | null) => ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const SelectTrigger = <T,>({
  placeholder = 'Select…',
  selectedDisplay,
  style,
}: SelectTriggerProps<T>) => {
  const { theme } = useTheme()
  const context = useSelectContext<T>()
  const [isPressed, setIsPressed] = useState(false)
  const interactive = !context.disabled && !context.readOnly
  const selectedOption = context.selectedId
    ? (context.idToOptionMap[context.selectedId] ?? null)
    : null

  const resolvedState = useMemo((): SelectState => ({
    color: context.config.color,
    isDisabled: !!context.disabled,
    isReadonly: !!context.readOnly,
    isInvalid: !!context.invalid,
    isOpen: context.isOpen,
    hasValue: !!context.selectedId,
    isPressed,
  }), [
    context.config.color,
    context.disabled,
    context.invalid,
    context.isOpen,
    context.readOnly,
    context.selectedId,
    isPressed,
  ])

  const selectTheme = theme.components.select
  const resolvedTriggerStyle = useMemoizedTheme(selectTheme.trigger, resolvedState)
  const resolvedStateLayerStyle = useMemoizedTheme(selectTheme.stateLayer, resolvedState)
  const resolvedTriggerTextStyle = useMemoizedTheme(selectTheme.triggerText, resolvedState)
  const resolvedIcon = useMemoizedTheme<SelectState, IconStyle>(selectTheme.icon, resolvedState)

  const customDisplay = selectedDisplay?.(selectedOption)
  const fallbackDisplay = selectedOption?.display
    ?? selectedOption?.label
    ?? placeholder
  const resolvedDisplay = selectedDisplay ? customDisplay : fallbackDisplay

  return (
    <Pressable
      disabled={!interactive}
      style={[resolvedTriggerStyle, style]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => context.toggleIsOpen()}
    >
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      {typeof resolvedDisplay === 'string' || typeof resolvedDisplay === 'number' ? (
        <ThemedText style={[resolvedTriggerTextStyle, { flex: 1 }]}>
          {resolvedDisplay}
        </ThemedText>
      ) : (
        resolvedDisplay
      )}
      <ThemedIcon
        icon={HightideIconRegistry.ChevronDown}
        size={resolvedIcon.size}
        strokeWidth={resolvedIcon.strokeWidth}
        color={resolvedIcon.color}
      />
    </Pressable>
  )
}
