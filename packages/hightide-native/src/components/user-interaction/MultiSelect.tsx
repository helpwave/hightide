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
import { Chip } from '../visualization-and-display/Chip'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ListActionItem } from '../list/ListActionItem'
import { IconButton } from './IconButton'
import { SearchBar } from './SearchBar'
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
import { useTranslation } from '@helpwave/hightide-utils/context'

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
  const translation = useTranslation()
  const interactive = !disabled && !readOnly

  const multiSelect = useMultiSelect({
    options,
    value: controlledValue,
    initialValue,
    onValueChange,
    onEditComplete,
  })

  const selectedOptions = useMemo(() => {
    return options.filter((option) => multiSelect.isSelected(option.id))
  }, [multiSelect, options])

  const state = useMemo((): MultiSelectState => ({
    color,
    isDisabled: disabled,
    isReadonly: readOnly,
    isInvalid: invalid,
    isOpen: multiSelect.isOpen,
    hasSelections: selectedOptions.length > 0,
    hasValue: selectedOptions.length > 0,
  }), [color, disabled, invalid, multiSelect.isOpen, readOnly, selectedOptions.length])

  const multiSelectTheme = theme.components.multiSelect

  const resolvedOverlayStyle = useMemo(
    () => multiSelectTheme.overlay({}),
    [multiSelectTheme]
  )
  const resolvedMenuStyle = useMemo(
    () => multiSelectTheme.menu({}),
    [multiSelectTheme]
  )
  const resolvedHeaderStyle = useMemo(
    () => multiSelectTheme.header({}),
    [multiSelectTheme]
  )
  const resolvedEmptyTextStyle = useMemo(
    () => multiSelectTheme.emptyText({}),
    [multiSelectTheme]
  )
  const visibleOptions = useMemo(
    () => options.filter((option) => multiSelect.visibleOptionIds.includes(option.id)),
    [options, multiSelect.visibleOptionIds]
  )
  const showEmptySearchResults = showSearch
    && multiSelect.searchQuery.trim().length > 0
    && visibleOptions.length === 0

  return (
    <View style={[{ width: '100%' }, style]}>
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
        {selectedOptions.length > 0
          ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
              {selectedOptions.map((option) => (
                <Chip key={option.id} size="md" color={color} variant="tonal">
                  <ThemedText>{option.label ?? option.id}</ThemedText>
                  {!state.isReadonly && (
                    <View
                      style={{
                        position: 'relative',
                        width: theme.icongraphy.sizes.sm,
                      }}
                    >
                      <IconButton
                        accessibilityLabel={translation('remove')}
                        size="sm"
                        color={theme.colors.negative}
                        variant="foreground"
                        disabled={!interactive}
                        onPress={() => multiSelect.toggleSelection(option.id, false)}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: [
                            { translateX: '-50%' },
                            { translateY: '-50%' },
                          ],
                        }}
                        icon={HightideIconRegistry.X}
                      />
                    </View>
                  )}
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
              <View style={resolvedHeaderStyle}>
                <SearchBar
                  value={multiSelect.searchQuery}
                  onValueChange={multiSelect.setSearchQuery}
                  onSearch={multiSelect.setSearchQuery}
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
                  const selected = multiSelect.isSelected(item.id)
                  const isHighlighted = multiSelect.highlightedId === item.id
                  const optionState = {
                    color,
                    isSelected: selected,
                    isHighlighted,
                    isDisabled: item.disabled,
                  }
                  const checkboxIcon = multiSelectTheme.checkboxIcon(optionState)
                  const optionColor = selected
                    ? (color ?? theme.colors.primary)
                    : undefined

                  return (
                    <ListActionItem
                      label={item.label ?? item.id}
                      color={optionColor}
                      disabled={item.disabled}
                      onPress={() => multiSelect.toggleSelection(item.id)}
                      leading={(
                        <View style={multiSelectTheme.checkbox(optionState)}>
                          {checkboxIcon.visible && (
                            <ThemedIcon
                              icon={HightideIconRegistry.Check}
                              size="sm"
                              color={checkboxIcon.color}
                            />
                          )}
                        </View>
                      )}
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
