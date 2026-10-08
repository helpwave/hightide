import type { TextInputProps, TextInputElementProps } from './TextInput'
import { TextInput } from './TextInput'
import { Search } from 'lucide-react'
import { Icon } from '../../visualization/Icon'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { HTMLAttributes } from 'react'
import type { IconButtonProps } from '../../interaction/IconButton'
import { IconButton } from '../../interaction/IconButton'
import { useControlledState, useEditCompletable } from '@helpwave/hightide-utils/hooks'

export type SearchBarProps = Omit<TextInputProps, 'onValueChange' | 'inputProps'>
  & TextInputElementProps
  & {
    onValueChange?: (value: string) => void,
    onSearch: (value: string) => void,
    searchButtonProps?: Omit<IconButtonProps, 'onClick'>,
    containerProps?: HTMLAttributes<HTMLDivElement>,
  }

export const SearchBar = ({
  value: controlledValue,
  initialValue = '',
  initialState,
  onValueChange,
  onSearch,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  state,
  onStateChange,
  onStateEvent,
  inputRef,
  searchButtonProps,
  containerProps,
  ...elementProps
}: SearchBarProps) => {
  const translation = useHightideTranslation()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const edit = useEditCompletable({
    value,
    onEditComplete: onSearch,
    isTimerEnabled: false,
  })
  return (
    <div {...containerProps} className={clsx('search-bar-container group/search-bar', containerProps?.className)}>
      <TextInput
        value={value}
        initialState={initialState}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        state={state}
        onStateChange={onStateChange}
        onStateEvent={onStateEvent}
        inputRef={inputRef}
        onValueChange={setValue}
        inputProps={{
          ...elementProps,
          onBlur: event => {
            elementProps.onBlur?.(event)
            edit.completeNow()
          },
          placeholder: elementProps.placeholder ?? translation('search'),
          className: clsx('search-bar-input', elementProps.className),
        }}
      />
      <IconButton
        {...searchButtonProps}
        tooltip={translation('search')}
        size="sm"
        color="neutral"
        variant="foreground"
        onClick={() => onSearch(value)}
        className={clsx('search-bar-icon-button', searchButtonProps?.className)}
      >
        <Icon icon={Search} size="sm" className="search-bar-icon" />
      </IconButton>
    </div>
  )
}
