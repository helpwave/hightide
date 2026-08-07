import { useMemo } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { Chip } from '../visualization-and-display/Chip'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import {
  useMultiSelect,
  type UseMultiSelectOption
} from '../../hooks/useMultiSelect'
import type { MultiSelectState } from '../../theme/types/components/multiSelect'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'

export type MultiSelectOption = UseMultiSelectOption

export type MultiSelectProps = Partial<FormFieldDataHandling<string[]>>
  & Partial<FormFieldInteractionStates>
  & {
    options: ReadonlyArray<MultiSelectOption>,
    value?: string[],
    initialValue?: string[],
    placeholder?: string,
    showSearch?: boolean,
    color?: ColorPairToken,
    style?: StyleProp<ViewStyle>,
  }

export const MultiSelect = ({
  options,
  value: controlledValue,
  initialValue = [],
  placeholder = 'Select…',
  showSearch = true,
  color,
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
    color,
    isDisabled: disabled,
    isReadonly: readOnly,
    isInvalid: invalid,
    isOpen: multiSelect.isOpen,
    hasSelections: selectedLabels.length > 0,
    hasValue: selectedLabels.length > 0,
  }), [color, disabled, invalid, multiSelect.isOpen, readOnly, selectedLabels.length])

  const multiSelectTheme = theme.components.multiSelect

  const resolvedOverlayStyle = useMemo(
    () => multiSelectTheme.overlay({}),
    [multiSelectTheme]
  )
  const resolvedMenuStyle = useMemo(
    () => multiSelectTheme.menu({}),
    [multiSelectTheme]
  )
  const resolvedSearchStyle = useMemo(
    () => multiSelectTheme.search({}),
    [multiSelectTheme]
  )
  const searchPlaceholderColor = useMemo(
    () => multiSelectTheme.searchPlaceholderColor({}),
    [multiSelectTheme]
  )

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => multiSelect.toggleOpen()}
        style={(pressableState) => {
          const interaction = pressableState as {
            pressed: boolean,
            hovered?: boolean,
            focused?: boolean,
            focusVisible?: boolean,
          }
          return multiSelectTheme.trigger({
            ...state,
            isPressed: interaction.pressed,
            isHovered: !!interaction.hovered,
            isFocused: !!interaction.focused,
            isFocusVisible: !!interaction.focusVisible,
          })
        }}
      >
        {selectedLabels.length > 0
          ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {selectedLabels.map((label) => (
                <Chip key={label} size="sm" color={color} coloringStyle="tonal">
                  {label}
                </Chip>
              ))}
            </View>
          )
          : <ThemedText style={multiSelectTheme.triggerText(state)}>{placeholder}</ThemedText>}
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
                  color,
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
                        <ThemedIcon icon={HightideIconRegistry.Check} size="sm" color={checkboxIcon.color} />
                      )}
                    </View>
                    <ThemedText style={multiSelectTheme.optionText(optionState)}>
                      {item.label}
                    </ThemedText>
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
