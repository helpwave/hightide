import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { MultiSelectOptionState } from '../../../theme/types/components/multiSelect'
import { ListActionItem } from '../../list/ListActionItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { useSelectContext } from './SelectContext'

export type SelectOptionProps<T = string> = {
  id: string,
  value: T,
  label: string,
  disabled?: boolean,
  children?: ReactNode,
}

export const SelectOption = <T,>({
  id,
  value,
  label,
  disabled = false,
  children,
}: SelectOptionProps<T>) => {
  const { theme } = useTheme()
  const context = useSelectContext<T>()
  const { registerOption } = context
  const display = children ?? label

  useEffect(() => {
    return registerOption({
      id,
      value,
      label,
      display,
      disabled,
    })
  }, [disabled, display, id, label, registerOption, value])

  const isSelected = context.selectedId === id
  const isVisible = context.visibleOptionIds.includes(id)

  const optionState = useMemo((): MultiSelectOptionState => ({
    isSelected,
    isHighlighted: context.highlightedId === id,
    isDisabled: disabled,
  }), [context.highlightedId, disabled, id, isSelected])

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
      disabled={disabled}
      onPress={() => context.toggleSelection(id)}
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
