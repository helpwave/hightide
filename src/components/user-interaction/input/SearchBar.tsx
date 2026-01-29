import type { InputProps } from './Input'
import { InputUncontrolled } from './Input'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { HTMLAttributes } from 'react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { IconButtonProps } from '../IconButton'
import { IconButton } from '../IconButton'

export type SearchBarProps = Omit<InputProps, 'onValueChange' | 'onEditComplete'> & {
  onValueChange?: (value: string) => void,
  onSearch: (value: string) => void,
  searchButtonProps?: Omit<IconButtonProps, 'onClick'>,
  containerProps?: HTMLAttributes<HTMLDivElement>,
}

export const SearchBar = ({
  value: initialValue,
  onSearch,
  onValueChange,
  searchButtonProps,
  containerProps,
  ...inputProps
}: SearchBarProps) => {
  const translation = useHightideTranslation()
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <div {...containerProps} className={clsx('relative', containerProps?.className)}>
      <InputUncontrolled
        {...inputProps}
        value={value}
        onValueChange={setValue}
        onEditComplete={onSearch}
        placeholder={inputProps.placeholder ?? translation('search')}
        // Styling applied via className
        className={clsx('pr-10 w-full', inputProps.className)}
      />
      <IconButton
        {...searchButtonProps}
        tooltip={translation('search')}
        size="sm"
        color="neutral"
        coloringStyle="text"
        onClick={() => onSearch(value)}
        className={clsx('absolute right-1 top-1/2 -translate-y-1/2', searchButtonProps?.className)}
      >
        <Search className="w-full h-full"/>
      </IconButton>
    </div>
  )
}