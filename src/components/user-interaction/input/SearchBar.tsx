import type { InputProps } from './Input'
import { Input } from './Input'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { HTMLAttributes } from 'react'
import type { IconButtonProps } from '../IconButton'
import { IconButton } from '../IconButton'
import { useControlledState } from '@/src/hooks/useControlledState'

export type SearchBarProps = Omit<InputProps, 'onValueChange' | 'onEditComplete'> & {
  onValueChange?: (value: string) => void,
  onSearch: (value: string) => void,
  searchButtonProps?: Omit<IconButtonProps, 'onClick'>,
  containerProps?: HTMLAttributes<HTMLDivElement>,
}

export const SearchBar = ({
  value: controlledValue,
  initialValue,
  onValueChange,
  onSearch,
  searchButtonProps,
  containerProps,
  ...inputProps
}: SearchBarProps) => {
  const translation = useHightideTranslation()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  return (
    <div {...containerProps} className={clsx('search-bar-container group/search-bar', containerProps?.className)}>
      <Input
        {...inputProps}
        value={value}
        onValueChange={setValue}
        onEditComplete={onSearch}
        placeholder={inputProps.placeholder ?? translation('search')}
        className={clsx('search-bar-input', inputProps.className)}
      />
      <IconButton
        {...searchButtonProps}
        tooltip={translation('search')}
        size="sm"
        color="neutral"
        coloringStyle="text"
        onClick={() => onSearch(value)}
        className={clsx('search-bar-icon-button', searchButtonProps?.className)}
      >
        <Search className="search-bar-icon"/>
      </IconButton>
    </div>
  )
}