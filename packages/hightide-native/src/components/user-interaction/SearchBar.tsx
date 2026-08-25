import {
  forwardRef,
  useMemo,
  useState
} from 'react'
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import {
  useControlledState,
  useDelay,
  type UseDelayOptionsResolved
} from '@helpwave/hightide-utils/hooks'
import { useTranslation } from '@helpwave/hightide-utils/context'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  SearchBarContainerStyle,
  SearchBarIconButtonStyle,
  SearchBarInputStyle,
  SearchBarState
} from '../../theme/types/components/searchBar'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import { IconButton, type IconButtonProps } from './IconButton'

export type SearchBarEditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type SearchBarEditCompleteOptions = Partial<SearchBarEditCompleteOptionsResolved>

const defaultEditCompleteOptions: SearchBarEditCompleteOptionsResolved = {
  allowEnterComplete: true,
  onBlur: true,
  afterDelay: false,
  delay: 2500,
}

export type SearchBarProps = Omit<TextInputProps, 'value' | 'style'>
  & Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & {
    color?: ColorPairToken,
    onSearch: (value: string) => void,
    searchButtonProps?: Omit<IconButtonProps, 'onPress' | 'icon' | 'accessibilityLabel'>,
    editCompleteOptions?: SearchBarEditCompleteOptions,
    initialValue?: string,
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleOverwrite<SearchBarState, SearchBarContainerStyle>,
    inputStyle?: StyleOverwrite<SearchBarState, SearchBarInputStyle>,
    iconButtonStyle?: StyleOverwrite<SearchBarState, SearchBarIconButtonStyle>,
    textStyle?: StyleProp<TextStyle>,
  }

export const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar({
  value: controlledValue,
  initialValue,
  color,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  onValueChange,
  onEditComplete,
  onSearch,
  searchButtonProps,
  editCompleteOptions,
  style,
  containerStyle,
  inputStyle,
  iconButtonStyle,
  textStyle,
  placeholder,
  ...props
}, ref) {
  const { theme } = useTheme()
  const translation = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })

  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete,
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const { restartTimer, clearTimer } = useDelay({
    delay,
    disabled: !afterDelay || disabled || readOnly,
  })

  const interactive = !disabled && !readOnly

  const state = useMemo((): SearchBarState => ({
    color,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadonly: readOnly,
    isHovered: interactive && isHovered,
    isPressed: interactive && isPressed,
    isFocused: interactive && isFocused,
  }), [color, disabled, invalid, readOnly, interactive, isHovered, isPressed, isFocused])

  const searchBarTheme = theme.components.searchBar
  const resolvedContainerStyle = useMemoizedTheme(searchBarTheme.container, state, containerStyle)
  const resolvedInputStyle = useMemoizedTheme(searchBarTheme.input, state, inputStyle)
  const resolvedPlaceholderStyle = useMemoizedTheme(searchBarTheme.placeholder, state)
  const resolvedIconButtonStyle = useMemoizedTheme(
    searchBarTheme.iconButton,
    state,
    iconButtonStyle ?? searchButtonProps?.style
  )
  const resolvedIconButtonColor = useMemoizedTheme(searchBarTheme.iconButtonColor, state)

  const commitSearch = (nextValue: string) => {
    onSearch(nextValue)
    onEditComplete?.(nextValue)
  }

  return (
    <View style={[resolvedContainerStyle, style]}>
      <TextInput
        {...props}
        ref={ref}
        value={value}
        editable={interactive}
        placeholder={placeholder ?? translation('search')}
        placeholderTextColor={resolvedPlaceholderStyle.color}
        onChangeText={(nextValue) => {
          props.onChangeText?.(nextValue)
          restartTimer(() => {
            commitSearch(nextValue)
          })
          setValue(nextValue)
        }}
        onFocus={(event) => {
          if (interactive) {
            setIsFocused(true)
          }
          props.onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsFocused(false)
          props.onBlur?.(event)
          if (allowEditCompleteOnBlur) {
            commitSearch(value ?? '')
            clearTimer()
          }
        }}
        onPressIn={(event) => {
          if (interactive) {
            setIsPressed(true)
          }
          props.onPressIn?.(event)
        }}
        onPressOut={(event) => {
          setIsPressed(false)
          props.onPressOut?.(event)
        }}
        onPointerEnter={(event) => {
          if (interactive) {
            setIsHovered(true)
          }
          props.onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          setIsHovered(false)
          props.onPointerLeave?.(event)
        }}
        onSubmitEditing={(event) => {
          props.onSubmitEditing?.(event)
          if (allowEnterComplete) {
            commitSearch(value ?? '')
            clearTimer()
          }
        }}
        style={[resolvedInputStyle, textStyle]}
        accessibilityState={{ disabled, selected: required }}
      />
      <IconButton
        {...searchButtonProps}
        icon={HightideIconRegistry.Search}
        accessibilityLabel={translation('search')}
        size="sm"
        color={searchButtonProps?.color ?? resolvedIconButtonColor}
        variant={searchButtonProps?.variant ?? 'foreground'}
        disabled={disabled || searchButtonProps?.disabled}
        onPress={() => commitSearch(value ?? '')}
        style={resolvedIconButtonStyle}
      />
    </View>
  )
})
