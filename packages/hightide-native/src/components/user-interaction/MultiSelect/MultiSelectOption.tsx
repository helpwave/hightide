import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { View } from 'react-native'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { MultiSelectOptionState } from '../../../theme/types/components/multiSelect'
import { ListActionItem } from '../../list/ListActionItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import type { MultiSelectOptionIdentity } from './MultiSelectContext'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectOptionProps<T = string> = (
  T extends string
    ? {
        valueId?: undefined,
        value: T,
        label?: string,
      }
    : {
        valueId: string,
        value: T,
        label: string,
      }
) & {
  disabled?: boolean,
  children?: ReactNode,
}

const toIdentity = <T,>(value: T, valueId: string | undefined): MultiSelectOptionIdentity<T> => {
  if (valueId === undefined) {
    return { value, id: value as string }
  }
  return { value, id: valueId }
}

export const MultiSelectOption = <T,>({
  value,
  valueId,
  label,
  disabled = false,
  children,
}: MultiSelectOptionProps<T>) => {
  const { theme } = useTheme()
  const context = useMultiSelectContext<T>()
  const { registerOption } = context
  const identity = useMemo(() => toIdentity<T>(value, valueId), [value, valueId])
  const resolvedLabel: string = valueId === undefined ? (label ?? (value as string)) : label
  const display = children ?? resolvedLabel
  const optionId = identity.id

  useEffect(() => {
    return registerOption({
      value: identity,
      label: resolvedLabel,
      display,
      disabled,
    })
  }, [disabled, display, identity, registerOption, resolvedLabel])

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
  }), [context.config.color, context.highlightedId, disabled, optionId, isSelected])

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
      title={children ? undefined : resolvedLabel}
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
