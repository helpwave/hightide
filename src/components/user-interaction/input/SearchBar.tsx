import type { InputProps } from './Input'
import { InputUncontrolled } from './Input'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { ButtonProps } from '@/src/components/user-interaction/Button'
import { Button } from '@/src/components/user-interaction/Button'
import type { HTMLAttributes } from 'react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type SearchBarProps = Omit<InputProps, 'onValueChange' | 'onEditComplete'> & {
  onValueChange?: (value: string) => void,
  onSearch: (value: string) => void,
  searchButtonProps?: Omit<ButtonProps, 'onClick'>,
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
        // TODO use data-name="searchbar" and move styling to css
        className={clsx('pr-10 w-full', inputProps.className)}
      />
      <Button
        {...searchButtonProps}
        size="sm"
        layout="icon"
        color="neutral"
        coloringStyle="text"
        onClick={() => onSearch(value)}
        className={clsx('absolute right-1 top-1/2 -translate-y-1/2', searchButtonProps?.className)}
      >
        <Search className="w-full h-full"/>
      </Button>
    </div>
  )
}