import type { InputProps } from './Input'
import { InputUncontrolled } from './Input'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { ButtonProps } from '@/src/components/user-action/Button'
import { Button } from '@/src/components/user-action/Button'
import type { HTMLAttributes } from 'react'
import React from 'react'

export type SearchBarProps = InputProps & {
  // TODO add searchValue to search
  onSearch?: (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  searchButtonProps?: Omit<ButtonProps, 'onClick'>,
  containerProps?: HTMLAttributes<HTMLDivElement>,
}

export const SearchBar = ({
                            onSearch,
                            searchButtonProps,
                            containerProps,
                            ...inputProps
                          }: SearchBarProps) => {
  const translation = useHightideTranslation()

  return (
    <div {...containerProps} className={clsx('relative', containerProps?.className)}>
      <InputUncontrolled
        {...inputProps}
        placeholder={inputProps.placeholder ?? translation('search')}
        // TODO use data-name={"SearchBar"} and move styling to css
        className={clsx('pr-10 w-full', inputProps.className)}
      />
      {onSearch && (
        <Button
          {...searchButtonProps}
          size="sm"
          layout="icon"
          color="neutral"
          coloringStyle="text"
          onClick={(event) => onSearch(event)}
          className={clsx('absolute right-1 top-1/2 -translate-y-1/2', searchButtonProps?.className)}
        >
          <Search className="w-full h-full"/>
        </Button>
      )}
    </div>
  )
}