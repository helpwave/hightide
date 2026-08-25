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
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import {
  useMultiSelect,
  type UseMultiSelectOption
} from '../../hooks/useMultiSelect'
import type {
  MultiSelectOptionState,
  MultiSelectState,
  MultiSelectThemeResolvers
} from '../../theme/types/components/multiSelect'
import type { IconStyle } from '../../icons'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { useTranslation } from '@helpwave/hightide-utils/context'
import type { PressableInteractionState } from '../../utils/pressableInteraction'

export type MultiSelectOption = UseMultiSelectOption

type MultiSelectTriggerContentProps = {
  pressableState: PressableInteractionState,
  state: MultiSelectState,
  placeholder: string,
  selectedOptions: ReadonlyArray<MultiSelectOption>,
  multiSelectTheme: MultiSelectThemeResolvers,
  color?: ColorPairToken,
  interactive: boolean,
  onRemove: (optionId: string) => void,
  removeLabel: string,
  iconSizeSm: number,
}

const MultiSelectTriggerContent = ({
  pressableState,
  state,
  placeholder,
  selectedOptions,
  multiSelectTheme,
  color,
  interactive,
  onRemove,
  removeLabel,
  iconSizeSm,
}: MultiSelectTriggerContentProps) => {
  const { theme } = useTheme()

  const triggerState = useMemo((): MultiSelectState => ({
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

  const resolvedTriggerStyle = useMemoizedTheme(multiSelectTheme.trigger, triggerState)
  const resolvedStateLayerStyle = useMemoizedTheme(multiSelectTheme.stateLayer, triggerState)
  const resolvedTriggerTextStyle = useMemoizedTheme(multiSelectTheme.triggerText, triggerState)

  return (
    <View style={resolvedTriggerStyle}>
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
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
                      width: iconSizeSm,
                      height: iconSizeSm,
                    }}
                  >
                    <IconButton
                      accessibilityLabel={removeLabel}
                      size="sm"
                      color={theme.colors.negative}
                      variant="foreground"
                      disabled={!interactive}
                      onPress={() => onRemove(option.id)}
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
        : (
          <ThemedText style={resolvedTriggerTextStyle}>
            {placeholder}
          </ThemedText>
        )}
    </View>
  )
}

type MultiSelectOptionRowProps = {
  item: MultiSelectOption,
  selected: boolean,
  isHighlighted: boolean,
  color?: ColorPairToken,
  multiSelectTheme: MultiSelectThemeResolvers,
  onToggle: () => void,
}

const MultiSelectOptionRow = ({
  item,
  selected,
  isHighlighted,
  color,
  multiSelectTheme,
  onToggle,
}: MultiSelectOptionRowProps) => {
  const { theme } = useTheme()
  const optionState = useMemo((): MultiSelectOptionState => ({
    color,
    isSelected: selected,
    isHighlighted,
    isDisabled: item.disabled,
  }), [color, selected, isHighlighted, item.disabled])
  const resolvedCheckboxStyle = useMemoizedTheme(multiSelectTheme.checkbox, optionState)
  const checkboxIcon = useMemoizedTheme<MultiSelectOptionState, IconStyle>(
    multiSelectTheme.checkboxIcon,
    optionState
  )
  const optionColor = selected
    ? (color ?? theme.colors.primary)
    : undefined

  return (
    <ListActionItem
      title={item.label ?? item.id}
      color={optionColor}
      disabled={item.disabled}
      onPress={onToggle}
      leading={(
        <View style={resolvedCheckboxStyle}>
          <ThemedIcon
            icon={HightideIconRegistry.Check}
            size={checkboxIcon.size}
            strokeWidth={checkboxIcon.strokeWidth}
            color={checkboxIcon.color}
          />
        </View>
      )}
    />
  )
}

export type MultiSelectProps = Partial<FormFieldDataHandling<string[]>>
  & Partial<FormFieldInteractionStates>
  & {
    options: ReadonlyArray<MultiSelectOption>,
    value?: string[],
    initialValue?: string[],
    placeholder?: string,
    searchableThreshold?: number,
    color?: ColorPairToken,
    style?: StyleProp<ViewStyle>,
  }

export const MultiSelect = ({
  options,
  value: controlledValue,
  initialValue = [],
  placeholder = 'Select…',
  searchableThreshold = 6,
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

  const isSearchVisible = options.length >= searchableThreshold

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

  const resolvedOverlayStyle = useMemoizedTheme(multiSelectTheme.overlay, {})
  const resolvedMenuStyle = useMemoizedTheme(multiSelectTheme.menu, { hasSearch: isSearchVisible })
  const resolvedHeaderStyle = useMemoizedTheme(multiSelectTheme.header, {})
  const resolvedEmptyTextStyle = useMemoizedTheme(multiSelectTheme.emptyText, {})
  const visibleOptions = useMemo(
    () => options.filter((option) => multiSelect.visibleOptionIds.includes(option.id)),
    [options, multiSelect.visibleOptionIds]
  )
  const showEmptySearchResults = isSearchVisible
    && multiSelect.searchQuery.trim().length > 0
    && visibleOptions.length === 0

  return (
    <View style={[{ width: '100%' }, style]}>
      <Pressable
        disabled={!interactive}
        onPress={() => multiSelect.toggleOpen()}
      >
        {(pressableState) => (
          <MultiSelectTriggerContent
            pressableState={pressableState as PressableInteractionState}
            state={state}
            placeholder={placeholder}
            selectedOptions={selectedOptions}
            multiSelectTheme={multiSelectTheme}
            color={color}
            interactive={interactive}
            onRemove={(optionId) => multiSelect.toggleSelection(optionId, false)}
            removeLabel={translation('remove')}
            iconSizeSm={theme.icongraphy.sizes.sm}
          />
        )}
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
            {isSearchVisible && (
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
                renderItem={({ item }) => (
                  <MultiSelectOptionRow
                    item={item}
                    selected={multiSelect.isSelected(item.id)}
                    isHighlighted={multiSelect.highlightedId === item.id}
                    color={color}
                    multiSelectTheme={multiSelectTheme}
                    onToggle={() => multiSelect.toggleSelection(item.id)}
                  />
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
