import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { IconStyle } from '../../../icons'
import type { MultiSelectOptionState } from '../../../theme/types/components/multiSelect'
import { ListActionItem } from '../../list/ListActionItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import type { SelectOptionIdentity } from './SelectContext'
import { useSelectContext } from './SelectContext'

export type SelectOptionProps<T = string> = (
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

const toIdentity = <T,>(value: T, valueId: string | undefined): SelectOptionIdentity<T> => {
  if (valueId === undefined) {
    return { value, id: value as string }
  }
  return { value, id: valueId }
}

export const SelectOption = <T,>({
  value,
  valueId,
  label,
  disabled = false,
  children,
}: SelectOptionProps<T>) => {
  const { theme } = useTheme()
  const context = useSelectContext<T>()
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

  const isSelected = context.selectedId === optionId
  const isVisible = context.visibleOptionIds.includes(optionId)

  const optionState = useMemo((): MultiSelectOptionState => ({
    isSelected,
    isHighlighted: context.highlightedId === optionId,
    isDisabled: disabled,
  }), [context.highlightedId, disabled, optionId, isSelected])

  const checkIcon = useMemoizedTheme<MultiSelectOptionState, IconStyle>(
    theme.components.listItem.action.icon,
    optionState
  )

  if (!context.isOpen || !isVisible) {
    return null
  }

  return (
    <ListActionItem
      title={children ? undefined : resolvedLabel}
      content={children}
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
