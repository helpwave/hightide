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
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { ThemedText } from '../visualization-and-display/ThemedText'
import {
  useSelect,
  type UseSelectOption
} from '../../hooks/useSelect'
import type { SelectState } from '../../theme/types/components/select'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'

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
    color?: ColorPairToken,
    style?: StyleProp<ViewStyle>,
  }

export const Select = ({
  options,
  value: controlledValue,
  initialValue = null,
  placeholder = 'Select…',
  showSearch = true,
  color,
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

  const state = useMemo((): SelectState => ({
    color,
    isDisabled: disabled,
    isReadonly: readOnly,
    isInvalid: invalid,
    isOpen: select.isOpen,
    hasValue: !!select.value,
  }), [color, disabled, invalid, readOnly, select.isOpen, select.value])

  const selectTheme = theme.components.select

  const resolvedOverlayStyle = useMemo(
    () => selectTheme.overlay({}),
    [selectTheme]
  )
  const resolvedMenuStyle = useMemo(
    () => selectTheme.menu({}),
    [selectTheme]
  )
  const resolvedSearchStyle = useMemo(
    () => selectTheme.search({}),
    [selectTheme]
  )
  const searchPlaceholderColor = useMemo(
    () => selectTheme.searchPlaceholderColor({}),
    [selectTheme]
  )

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => select.toggleOpen()}
        style={(pressableState) => {
          const interaction = pressableState as {
            pressed: boolean,
            hovered?: boolean,
            focused?: boolean,
          }
          return selectTheme.trigger({
            ...state,
            isPressed: interaction.pressed,
            isHovered: !!interaction.hovered,
            isFocused: !!interaction.focused,
          })
        }}
      >
        {(pressableState) => {
          const interaction = pressableState as {
            pressed: boolean,
            hovered?: boolean,
            focused?: boolean,
          }
          return (
            <ThemedText style={selectTheme.triggerText({
              ...state,
              isPressed: interaction.pressed,
              isHovered: !!interaction.hovered,
              isFocused: !!interaction.focused,
            })}
            >
              {selectedLabel}
            </ThemedText>
          )
        }}
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
            {showSearch && (
              <TextInput
                value={select.searchQuery}
                onChangeText={select.setSearchQuery}
                placeholder="Search…"
                placeholderTextColor={searchPlaceholderColor}
                style={resolvedSearchStyle}
              />
            )}
            <FlatList
              data={options.filter((option) => select.visibleOptionIds.includes(option.id))}
              keyExtractor={(option) => option.id}
              renderItem={({ item }) => {
                const isSelected = select.value === item.id
                const isHighlighted = select.highlightedValue === item.id
                const optionState = {
                  color,
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
                    <ThemedText style={selectTheme.optionText(optionState)}>
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
