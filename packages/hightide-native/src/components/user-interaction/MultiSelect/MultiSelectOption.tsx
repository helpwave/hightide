import type { ReactNode } from 'react'
import { useEffect, useId, useMemo } from 'react'
import { View } from 'react-native'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { MultiSelectOptionState } from '../../../theme/types/components/multiSelect'
import { ListActionItem } from '../../list/ListActionItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectOptionProps<T = string> = {
  value: T,
  label: string,
  disabled?: boolean,
  children?: ReactNode,
}

export const MultiSelectOption = <T,>({
  value,
  label,
  disabled = false,
  children,
}: MultiSelectOptionProps<T>) => {
  const { theme } = useTheme()
  const context = useMultiSelectContext<T>()
  const { registerOption } = context
  const generatedId = useId()
  const optionId = `multi-select-option-${generatedId}`
  const display = children ?? label

  useEffect(() => {
    return registerOption({
      id: optionId,
      value,
      label,
      display,
      disabled,
    })
  }, [disabled, display, label, optionId, registerOption, value])

  const isSelected = context.selectedIds.includes(optionId)
  const isVisible = context.visibleOptionIds.includes(optionId)
  const optionColor = isSelected
    ? (context.config.color ?? theme.colors.primary)
    : undefined

  const optionState = useMemo((): MultiSelectOptionState => ({
    color: context.config.color,
    isSelected,
    isHighlighted: context.highlightedId === optionId,
    isDisabled: disabled,
  }), [context.config.color, context.highlightedId, disabled, isSelected, optionId])

  const multiSelectTheme = theme.components.multiSelect
  const resolvedCheckboxStyle = useMemoizedTheme(multiSelectTheme.checkbox, optionState)
  const checkboxIcon = useMemoizedTheme<MultiSelectOptionState, IconStyle>(
    multiSelectTheme.checkboxIcon,
    optionState
  )

  if (!context.isOpen || !isVisible) {
    return null
  }

  return (
    <ListActionItem
      title={children ? undefined : label}
      content={children}
      color={optionColor}
      disabled={disabled}
      onPress={() => context.toggleSelection(optionId)}
      leading={(
        <View style={resolvedCheckboxStyle}>
          <ThemedIcon
            icon={HightideIconRegistry.Check}
            size={checkboxIcon.size}
            strokeWidth={checkboxIcon.strokeWidth}
            color={checkboxIcon.color}
          />
        </View>
      )}
    />
  )
}
