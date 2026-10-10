import type { TextInputProps } from './TextInput'
import { TextInput } from './TextInput'
import { Search } from 'lucide-react'
import { Icon } from '../../visualization/Icon'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { HTMLAttributes } from 'react'
import type { IconButtonProps } from '../../interaction/IconButton'
import { IconButton } from '../../interaction/IconButton'
import { useControlledState, useEditCompletable } from '@helpwave/hightide-utils/hooks'

export type SearchBarProps = TextInputProps
  & {
    onSearch: (value: string) => void,
    searchButtonProps?: IconButtonProps,
    containerProps?: HTMLAttributes<HTMLDivElement>,
  }

export const SearchBar = ({
  value: controlledValue,
  initialValue,
  onValueChange,
  onSearch,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  onStateEvent,
  inputRef,
  inputProps,
  searchButtonProps,
  containerProps,
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
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        onStateEvent={onStateEvent}
        inputRef={inputRef}
        onValueChange={setValue}
        inputProps={{
          ...inputProps,
          onBlur: event => {
            inputProps?.onBlur?.(event)
            edit.completeNow()
          },
          placeholder: inputProps?.placeholder ?? translation('search'),
          className: clsx('search-bar-input', inputProps?.className),
        }}
      />
      <IconButton
        {...searchButtonProps}
        tooltip={translation('search')}
        size="sm"
        color="neutral"
        variant="foreground"
        onClick={(e) => {
          searchButtonProps?.onClick?.(e)
          onSearch(value)
        }}
        className={clsx('search-bar-icon-button', searchButtonProps?.className)}
      >
        <Icon icon={Search} size="sm" className="search-bar-icon" />
      </IconButton>
    </div>
  )
}
