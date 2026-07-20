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
import { useSelect, type UseSelectOption } from '../../hooks/useSelect'
import { useTheme } from '../../global-contexts/theme'
import type { SelectState } from '../../theme'
import type { FormFieldDataHandling, FormFieldInteractionStates } from '../../types/formField'

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
    showSearch?: boolean,
    style?: StyleProp<ViewStyle>,
  }

export const Select = ({
  options,
  value: controlledValue,
  initialValue = null,
  placeholder = 'Select…',
  showSearch = true,
  disabled = false,
  readOnly = false,
  invalid = false,
  onValueChange,
  onEditComplete,
  style,
}: SelectProps) => {
  const { theme } = useTheme()
  const interactive = !disabled && !readOnly

  const select = useSelect({
    options,
    value: controlledValue,
    initialValue,
    onValueChange,
    onEditComplete,
  })

  const selectedLabel = useMemo(() => {
    const selected = options.find((option) => option.id === select.value)
    return selected?.label ?? placeholder
  }, [options, placeholder, select.value])

  const state: SelectState = {
    isDisabled: disabled,
    isReadOnly: readOnly,
    isInvalid: invalid,
    isOpen: select.isOpen,
    hasValue: !!select.value,
  }

  const selectTheme = theme.components.select

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => select.toggleOpen()}
        style={selectTheme.trigger(state)}
      >
        <Text style={selectTheme.triggerText(state)}>
          {selectedLabel}
        </Text>
      </Pressable>

      <Modal
        visible={select.isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => select.setIsOpen(false)}
      >
        <Pressable
          style={selectTheme.overlay(state)}
          onPress={() => select.setIsOpen(false)}
        >
          <Pressable
            style={selectTheme.menu(state)}
            onPress={(event) => event.stopPropagation()}
          >
            {showSearch && (
              <TextInput
                value={select.searchQuery}
                onChangeText={select.setSearchQuery}
                placeholder="Search…"
                placeholderTextColor={selectTheme.searchPlaceholderColor(state)}
                style={selectTheme.search(state)}
              />
            )}
            <FlatList
              data={options.filter((option) => select.visibleOptionIds.includes(option.id))}
              keyExtractor={(option) => option.id}
              renderItem={({ item }) => {
                const isSelected = select.value === item.id
                const isHighlighted = select.highlightedValue === item.id
                const optionState = {
                  isSelected,
                  isHighlighted,
                  isDisabled: item.disabled,
                }

                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => select.selectValue(item.id)}
                    style={selectTheme.option(optionState)}
                  >
                    <Text style={selectTheme.optionText(optionState)}>
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
