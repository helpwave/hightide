import { Fragment, useMemo } from 'react'
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
import { ThemedText } from '../visualization-and-display/ThemedText'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ListActionItem } from '../list/ListActionItem'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import {
  useSelect,
  type UseSelectOption
} from '../../hooks/useSelect'
import type { SelectState } from '../../theme/types/components/select'
import type { Color } from '../../theme/types/color'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { SearchBar } from './SearchBar'

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
  const translation = useTranslation()
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

  const resolvedOverlayStyle = useMemo(
    () => selectTheme.overlay({}),
    [selectTheme]
  )
  const resolvedMenuStyle = useMemo(
    () => selectTheme.menu({ hasSearch: showSearch }),
    [selectTheme, showSearch]
  )
  const resolvedHeaderStyle = useMemo(
    () => selectTheme.header({}),
    [selectTheme]
  )
  const resolvedEmptyTextStyle = useMemo(
    () => selectTheme.emptyText({}),
    [selectTheme]
  )
  const showEmptySearchResults = showSearch
    && select.searchQuery.trim().length > 0
    && visibleOptions.length === 0

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
            focusVisible?: boolean,
          }
          return selectTheme.trigger({
            ...state,
            isPressed: interaction.pressed,
            isHovered: !!interaction.hovered,
            isFocused: !!interaction.focused,
            isFocusVisible: !!interaction.focusVisible,
          })
        }}
      >
        {(pressableState) => {
          const interaction = pressableState as {
            pressed: boolean,
            hovered?: boolean,
            focused?: boolean,
            focusVisible?: boolean,
          }
          const triggerState = {
            ...state,
            isPressed: interaction.pressed,
            isHovered: !!interaction.hovered,
            isFocused: !!interaction.focused,
            isFocusVisible: !!interaction.focusVisible,
          }
          const icon = selectTheme.icon(triggerState)

          return (
            <Fragment>
              <ThemedText style={[selectTheme.triggerText(triggerState), { flex: 1 }]}>
                {selectedLabel}
              </ThemedText>
              <ThemedIcon
                icon={HightideIconRegistry.ChevronDown}
                size={icon.size}
                strokeWidth={icon.strokeWidth}
                color={icon.color}
              />
            </Fragment>
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
                  const checkIcon = theme.components.listItem.action.icon({ color: optionColor })

                  return (
                    <ListActionItem
                      title={item.label ?? item.id}
                      color={optionColor}
                      disabled={item.disabled}
                      onPress={() => select.selectValue(item.id)}
                      trailing={isSelected
                        ? (
                          <ThemedIcon
                            icon={HightideIconRegistry.Check}
                            size={checkIcon.size}
                            strokeWidth={checkIcon.strokeWidth}
                            color={checkIcon.color as Color | undefined}
                          />
                        )
                        : undefined}
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
