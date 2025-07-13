import type { InputProps } from './Input'
import { Input } from './Input'
import { useTranslation } from '../../localization/useTranslation'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import { IconButton } from './Button'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'

type TranslationType = FormTranslationType

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
  const translation = useTranslation<TranslationType>([formTranslation])

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