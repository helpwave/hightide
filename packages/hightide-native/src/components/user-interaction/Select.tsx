import { useMemo } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useTranslation } from '@helpwave/hightide-utils/context'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ListActionItem } from '../list/ListActionItem'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import {
  useSelect,
  type UseSelectOption
} from '../../hooks/useSelect'
import type { SelectState, SelectThemeResolvers } from '../../theme/types/components/select'
import type { MultiSelectOptionState } from '../../theme/types/components/multiSelect'
import type { IconStyle } from '../../icons'
import type { PressableInteractionState } from '../../utils/pressableInteraction'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { SearchBar } from './SearchBar'

type SelectTriggerContentProps = {
  pressableState: PressableInteractionState,
  state: SelectState,
  selectedLabel: string,
  selectTheme: SelectThemeResolvers,
}

const SelectTriggerContent = ({
  pressableState,
  state,
  selectedLabel,
  selectTheme,
}: SelectTriggerContentProps) => {
  const triggerState = useMemo((): SelectState => ({
    ...state,
    isPressed: pressableState.pressed,
    isHovered: !!pressableState.hovered,
    isFocused: !!pressableState.focused,
    isFocusVisible: !!pressableState.focusVisible,
  }), [
    state,
    pressableState.pressed,
    pressableState.hovered,
    pressableState.focused,
    pressableState.focusVisible,
  ])

  const resolvedTriggerStyle = useMemoizedTheme(selectTheme.trigger, triggerState)
  const resolvedStateLayerStyle = useMemoizedTheme(selectTheme.stateLayer, triggerState)
  const resolvedTriggerTextStyle = useMemoizedTheme(selectTheme.triggerText, triggerState)
  const resolvedIcon = useMemoizedTheme<SelectState, IconStyle>(selectTheme.icon, triggerState)

  return (
    <View style={resolvedTriggerStyle}>
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      <ThemedText style={[resolvedTriggerTextStyle, { flex: 1 }]}>
        {selectedLabel}
      </ThemedText>
      <ThemedIcon
        icon={HightideIconRegistry.ChevronDown}
        size={resolvedIcon.size}
        strokeWidth={resolvedIcon.strokeWidth}
        color={resolvedIcon.color}
      />
    </View>
  )
}

type SelectOptionRowProps = {
  item: SelectOption,
  isSelected: boolean,
  optionColor?: ColorPairToken,
  onSelect: () => void,
}

const SelectOptionRow = ({
  item,
  isSelected,
  optionColor,
  onSelect,
}: SelectOptionRowProps) => {
  const { theme } = useTheme()
  const optionState = useMemo((): MultiSelectOptionState => ({
    color: optionColor,
    isSelected,
    isHighlighted: false,
    isDisabled: item.disabled,
  }), [optionColor, isSelected, item.disabled])
  const checkIcon = useMemoizedTheme<MultiSelectOptionState, IconStyle>(
    theme.components.listItem.action.icon,
    optionState
  )

  return (
    <ListActionItem
      title={item.label ?? item.id}
      color={optionColor}
      disabled={item.disabled}
      onPress={onSelect}
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

export type SelectOption<T extends string = string> = UseSelectOption & {
  value?: T,
}

export type SelectProps = Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & {
    options: ReadonlyArray<SelectOption>,
    value?: string | null,
    initialValue?: string | null,
    placeholder?: string,
    searchableThreshold?: number,
    color?: ColorPairToken,
    style?: StyleProp<ViewStyle>,
  }

export const Select = ({
  options,
  value: controlledValue,
  initialValue = null,
  placeholder = 'Select…',
  searchableThreshold = 6,
  color,
  disabled = false,
  readOnly = false,
  invalid = false,
  onValueChange,
  onEditComplete,
  style,
}: SelectProps) => {
  const { theme } = useTheme()
  const translation = useTranslation()
  const interactive = !disabled && !readOnly

  const select = useSelect({
    options,
    value: controlledValue,
    initialValue,
    onValueChange,
    onEditComplete,
  })

  const isSearchVisible = options.length >= searchableThreshold

  const selectedLabel = useMemo(() => {
    const selected = options.find((option) => option.id === select.value)
    return selected?.label ?? placeholder
  }, [options, placeholder, select.value])

  const visibleOptions = useMemo(
    () => options.filter((option) => select.visibleOptionIds.includes(option.id)),
    [options, select.visibleOptionIds]
  )

  const state = useMemo((): SelectState => ({
    color,
    isDisabled: disabled,
    isReadonly: readOnly,
    isInvalid: invalid,
    isOpen: select.isOpen,
    hasValue: !!select.value,
  }), [color, disabled, invalid, readOnly, select.isOpen, select.value])

  const selectTheme = theme.components.select

  const resolvedOverlayStyle = useMemoizedTheme(selectTheme.overlay, {})
  const resolvedMenuStyle = useMemoizedTheme(selectTheme.menu, { hasSearch: isSearchVisible })
  const resolvedHeaderStyle = useMemoizedTheme(selectTheme.header, {})
  const resolvedEmptyTextStyle = useMemoizedTheme(selectTheme.emptyText, {})
  const showEmptySearchResults = isSearchVisible
    && select.searchQuery.trim().length > 0
    && visibleOptions.length === 0

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => select.toggleOpen()}
      >
        {(pressableState) => (
          <SelectTriggerContent
            pressableState={pressableState as PressableInteractionState}
            state={state}
            selectedLabel={selectedLabel}
            selectTheme={selectTheme}
          />
        )}
      </Pressable>

      <Modal
        visible={select.isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => select.setIsOpen(false)}
      >
        <Pressable
          style={resolvedOverlayStyle}
          onPress={() => select.setIsOpen(false)}
        >
          <Pressable
            style={resolvedMenuStyle}
            onPress={(event) => event.stopPropagation()}
          >
            {isSearchVisible && (
              <View style={resolvedHeaderStyle}>
                <SearchBar
                  value={select.searchQuery}
                  onValueChange={select.setSearchQuery}
                  onSearch={select.setSearchQuery}
                />
              </View>
            )}
            {showEmptySearchResults ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText style={resolvedEmptyTextStyle}>
                  {translation('nothingFound')}
                </ThemedText>
              </View>
            ) : (
              <FlatList
                data={visibleOptions}
                keyExtractor={(option) => option.id}
                style={{ flex: 1 }}
                renderItem={({ item }) => {
                  const isSelected = select.value === item.id
                  const optionColor = isSelected
                    ? (color ?? theme.colors.primary)
                    : undefined

                  return (
                    <SelectOptionRow
                      item={item}
                      isSelected={isSelected}
                      optionColor={optionColor}
                      onSelect={() => select.selectValue(item.id)}
                    />
                  )
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
