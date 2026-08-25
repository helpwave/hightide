import type { ReactNode } from 'react'
import { useEffect, useId, useMemo } from 'react'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { MultiSelectOptionState } from '../../../theme/types/components/multiSelect'
import { ListActionItem } from '../../list/ListActionItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { useSelectContext } from './SelectContext'

export type SelectOptionProps<T = string> = {
  value: T,
  label: string,
  disabled?: boolean,
  children?: ReactNode,
}

export const SelectOption = <T,>({
  value,
  label,
  disabled = false,
  children,
}: SelectOptionProps<T>) => {
  const { theme } = useTheme()
  const context = useSelectContext<T>()
  const { registerOption } = context
  const generatedId = useId()
  const optionId = `select-option-${generatedId}`
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

  const isSelected = context.selectedId === optionId
  const isVisible = context.visibleOptionIds.includes(optionId)
  const optionColor = isSelected
    ? (context.config.color ?? theme.colors.primary)
    : undefined

  const optionState = useMemo((): MultiSelectOptionState => ({
    color: optionColor,
    isSelected,
    isHighlighted: context.highlightedId === optionId,
    isDisabled: disabled,
  }), [context.highlightedId, disabled, isSelected, optionColor, optionId])

  const checkIcon = useMemoizedTheme<MultiSelectOptionState, IconStyle>(
    theme.components.listItem.action.icon,
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
        <ThemedIcon
          icon={HightideIconRegistry.Check}
          size={checkIcon.size}
          strokeWidth={checkIcon.strokeWidth}
          color={isSelected ? theme.colors.primary.color : 'transparent'}
        />
      )}
    />
  )
}
