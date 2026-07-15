import { getComponentColors, getSemanticColors, remToPx } from '@helpwave/hightide-design'
import { Check } from 'lucide-react-native'
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
import { Chip } from '../Chip/Chip'
import { Icon } from '../../icons/Icon'
import { useMultiSelect, type UseMultiSelectOption } from '../../hooks/useMultiSelect'
import { useThemeMode } from '../../theme/ThemeContext'
import type { FormFieldDataHandling, FormFieldInteractionStates } from '../../types/formField'

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

const CheckboxIndicator = ({ checked }: { checked: boolean }) => {
  const mode = useThemeMode()
  const semantic = getSemanticColors(mode)
  const component = getComponentColors(mode)

  return (
    <View style={{
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: checked ? semantic.primary : component.border,
      backgroundColor: checked ? semantic.primary : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {checked && <Icon icon={Check} size="sm" color={semantic.onPrimary} />}
    </View>
  )
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
  const mode = useThemeMode()
  const semantic = getSemanticColors(mode)
  const component = getComponentColors(mode)
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

  const borderColor = invalid ? semantic.negative : component.border

  return (
    <View style={style}>
      <Pressable
        disabled={!interactive}
        onPress={() => multiSelect.toggleOpen()}
        style={{
          minHeight: 44,
          paddingHorizontal: remToPx('0.75rem'),
          paddingVertical: remToPx('0.5rem'),
          borderRadius: remToPx('0.375rem'),
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled ? semantic.disabled : component.input.background,
          justifyContent: 'center',
          gap: 8,
          opacity: disabled ? 0.6 : 1,
        }}
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
          : <Text style={{ color: semantic.placeholder }}>{placeholder}</Text>}
      </Pressable>

      <Modal
        visible={multiSelect.isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => multiSelect.setIsOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 }}
          onPress={() => multiSelect.setIsOpen(false)}
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
                value={multiSelect.searchQuery}
                onChangeText={multiSelect.setSearchQuery}
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
              data={options.filter((option) => multiSelect.visibleOptionIds.includes(option.id))}
              keyExtractor={(option) => option.id}
              renderItem={({ item }) => {
                const selected = multiSelect.isSelected(item.id)
                const isHighlighted = multiSelect.highlightedId === item.id
                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => multiSelect.toggleSelection(item.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      backgroundColor: isHighlighted ? component.table.rowHoverBackground : 'transparent',
                      opacity: item.disabled ? 0.5 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <CheckboxIndicator checked={selected} />
                    <Text style={{
                      color: selected ? semantic.primary : component.menu.text,
                      fontWeight: selected ? '600' : '400',
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
