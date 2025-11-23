import type { InputProps } from './input/Input'
import { Input } from './input/Input'
import { IconButton } from './Button'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

export type SearchBarProps = InputProps & {
  onSearch?: () => void,
  disableOnSearch?: boolean,
  containerClassName?: string,
}

export const SearchBar = ({
                            placeholder,
                            onSearch,
                            disableOnSearch,
                            containerClassName,
                            ...inputProps
                          }: SearchBarProps) => {
  const translation = useHightideTranslation()

  return (
    <div className={clsx('flex-row-2 justify-between items-center', containerClassName)}>
      <Input
        {...inputProps}
        placeholder={placeholder ?? translation('search')}
      />
      {onSearch && (
        <IconButton color="neutral" disabled={disableOnSearch} onClick={onSearch}>
          <Search className="w-full h-full"/>
        </IconButton>
      )}
    </div>
  )
}