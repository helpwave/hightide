import { useMemo } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { Check } from 'lucide-react-native'

import { Chip } from '@/src/components/visualization-and-display/Chip'
import { Icon } from '@/src/components/visualization-and-display/Icon'
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import {
  useMultiSelect,
  type UseMultiSelectOption
} from '@/src/hooks/useMultiSelect'
import type { MultiSelectState } from '@/src/theme/types/components/multiSelect'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '@/src/types/formField'

export type MultiSelectOption = UseMultiSelectOption

export type MultiSelectProps = Partial<FormFieldDataHandling<string[]>>
  & Partial<FormFieldInteractionStates>
  & {
    options: ReadonlyArray<MultiSelectOption>,
    value?: string[],
    initialValue?: string[],
    placeholder?: string,
    showSearch?: boolean,
    style?: StyleProp<ViewStyle>,
  }

export const MultiSelect = ({
  options,
  value: controlledValue,
  initialValue = [],
  placeholder = 'Select…',
  showSearch = true,
  disabled = false,
  readOnly = false,
  invalid = false,
  onValueChange,
  onEditComplete,
  style,
}: MultiSelectProps) => {
  const { theme } = useTheme()
  const interactive = !disabled && !readOnly

  const multiSelect = useMultiSelect({
    options,
    value: controlledValue,
    initialValue,
    onValueChange,
    onEditComplete,
  })

  const selectedLabels = useMemo(() => {
    return options
      .filter((option) => multiSelect.isSelected(option.id))
      .map((option) => option.label ?? option.id)
  }, [multiSelect, options])

  const state = useMemo((): MultiSelectState => ({
    isDisabled: disabled,
    isReadOnly: readOnly,
    isInvalid: invalid,
    isOpen: multiSelect.isOpen,
    hasSelections: selectedLabels.length > 0,
    hasValue: selectedLabels.length > 0,
  }), [disabled, invalid, multiSelect.isOpen, readOnly, selectedLabels.length])

  const multiSelectTheme = theme.components.multiSelect

  const resolvedTriggerStyle = useMemo(
    () => multiSelectTheme.trigger(state),
    [multiSelectTheme, state]
  )
  const resolvedTriggerTextStyle = useMemo(
    () => multiSelectTheme.triggerText(state),
    [multiSelectTheme, state]
  )
  const resolvedOverlayStyle = useMemo(
    () => multiSelectTheme.overlay(state),
    [multiSelectTheme, state]
  )
  const resolvedMenuStyle = useMemo(
    () => multiSelectTheme.menu(state),
    [multiSelectTheme, state]
  )
  const resolvedSearchStyle = useMemo(
    () => multiSelectTheme.search(state),
    [multiSelectTheme, state]
  )
  const searchPlaceholderColor = useMemo(
    () => multiSelectTheme.searchPlaceholderColor(state),
    [multiSelectTheme, state]
  )

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => multiSelect.toggleOpen()}
        style={resolvedTriggerStyle}
      >
        {selectedLabels.length > 0
          ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {selectedLabels.map((label) => (
                <Chip key={label} size="sm" color="primary" coloringStyle="tonal">
                  {label}
                </Chip>
              ))}
            </View>
          )
          : <Text style={resolvedTriggerTextStyle}>{placeholder}</Text>}
      </Pressable>

      <Modal
        visible={multiSelect.isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => multiSelect.setIsOpen(false)}
      >
        <Pressable
          style={resolvedOverlayStyle}
          onPress={() => multiSelect.setIsOpen(false)}
        >
          <Pressable
            style={resolvedMenuStyle}
            onPress={(event) => event.stopPropagation()}
          >
            {showSearch && (
              <TextInput
                value={multiSelect.searchQuery}
                onChangeText={multiSelect.setSearchQuery}
                placeholder="Search…"
                placeholderTextColor={searchPlaceholderColor}
                style={resolvedSearchStyle}
              />
            )}
            <FlatList
              data={options.filter((option) => multiSelect.visibleOptionIds.includes(option.id))}
              keyExtractor={(option) => option.id}
              renderItem={({ item }) => {
                const selected = multiSelect.isSelected(item.id)
                const isHighlighted = multiSelect.highlightedId === item.id
                const optionState = {
                  isSelected: selected,
                  isHighlighted,
                  isDisabled: item.disabled,
                }
                const checkboxIcon = multiSelectTheme.checkboxIcon(optionState)

                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => multiSelect.toggleSelection(item.id)}
                    style={multiSelectTheme.option(optionState)}
                  >
                    <View style={multiSelectTheme.checkbox(optionState)}>
                      {checkboxIcon.visible && (
                        <Icon icon={Check} size="sm" color={checkboxIcon.color} />
                      )}
                    </View>
                    <Text style={multiSelectTheme.optionText(optionState)}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
