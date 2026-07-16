import { getComponentColors, getSemanticColors, remToPx } from '@helpwave/hightide-design'
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
import { useThemeMode } from '../../global-contexts/theme'
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
  const mode = useThemeMode()
  const semantic = getSemanticColors(mode)
  const component = getComponentColors(mode)
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

  const borderColor = invalid ? semantic.negative : component.border

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => select.toggleOpen()}
        style={{
          minHeight: 44,
          paddingHorizontal: remToPx('0.75rem'),
          paddingVertical: remToPx('0.5rem'),
          borderRadius: remToPx('0.375rem'),
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled ? semantic.disabled : component.input.background,
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text style={{ color: select.value ? component.input.text : semantic.placeholder }}>
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
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 }}
          onPress={() => select.setIsOpen(false)}
        >
          <Pressable
            style={{
              maxHeight: 360,
              borderRadius: 12,
              backgroundColor: component.menu.background,
              borderWidth: 1,
              borderColor: component.menu.border,
              overflow: 'hidden',
            }}
            onPress={(event) => event.stopPropagation()}
          >
            {showSearch && (
              <TextInput
                value={select.searchQuery}
                onChangeText={select.setSearchQuery}
                placeholder="Search…"
                placeholderTextColor={semantic.placeholder}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: component.menu.border,
                  color: component.menu.text,
                }}
              />
            )}
            <FlatList
              data={options.filter((option) => select.visibleOptionIds.includes(option.id))}
              keyExtractor={(option) => option.id}
              renderItem={({ item }) => {
                const isSelected = select.value === item.id
                const isHighlighted = select.highlightedValue === item.id
                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => select.selectValue(item.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      backgroundColor: isHighlighted ? component.table.rowHoverBackground : 'transparent',
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? semantic.primary : component.menu.text,
                      fontWeight: isSelected ? '600' : '400',
                    }}>
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
