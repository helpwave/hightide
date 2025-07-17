import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import { ListTile } from '../layout-and-navigation/Tile'
import { ExpansionIcon } from '../layout-and-navigation/Expandable'
import type { MenuBag, MenuProps } from './Menu'
import { Menu } from './Menu'
import { SearchBar } from './SearchBar'
import type { UseSearchProps } from '../../hooks/useSearch'
import { useSearch } from '../../hooks/useSearch'

export type SelectOption<T> = {
  label: ReactNode,
  value: T,
  searchTags?: string[],
  disabled?: boolean,
  className?: string,
}

export type SelectBag<T> = MenuBag & {
  selected?: T,
  search: string,
}

export type SelectProps<T> = Omit<MenuProps<HTMLButtonElement>, 'trigger' | 'children'> & {
  value?: T,
  label?: LabelProps,
  options: SelectOption<T>[],
  onChange: (value: T) => void,
  hintText?: string,
  selectedDisplayOverwrite?: ReactNode,
  searchOptions?: Omit<UseSearchProps<SelectOption<T>>, 'list' | 'searchMapping'>,
  additionalItems?: (bag: SelectBag<T>) => ReactNode,
  className?: string,
  triggerClassName?: string,
  hintTextClassName?: string,
};

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = <T, >({
                              value,
                              label,
                              options,
                              onChange,
                              hintText = '',
                              selectedDisplayOverwrite,
                              searchOptions,
                              additionalItems,
                              className,
                              triggerClassName,
                              hintTextClassName,
                              ...menuProps
                            }: SelectProps<T>) => {
  const selectedOption = options.find(option => option.value === value)
  if (value !== undefined && selectedOption === undefined && selectedDisplayOverwrite === undefined) {
    console.warn('The selected value is not found in the options list. This might be an error on your part or' +
      ' default behavior if it is complex data type on which === does not work. In case of the latter' +
      ' use selectedDisplayOverwrite to set your selected text or component')
  }

  const isShowingHint = !selectedDisplayOverwrite && !selectedOption?.label

  const { result, search, setSearch } = useSearch<SelectOption<T>>({
    list: options,
    searchMapping: useCallback((item: SelectOption<T>) => item.searchTags, []),
    ...searchOptions
  })

  return (
    <div className={clsx(className)}>
      {label && (
        <Label {...label} labelType={label.labelType ?? 'labelBig'} className={clsx('mb-1', label.className)}/>
      )}
      <Menu<HTMLButtonElement>
        {...menuProps}
        trigger={({ toggleOpen, isOpen, disabled }, ref) => (
          <button
            ref={ref}
            className={clsx(
              'btn-md justify-between w-full border-2',
              {
                'rounded-b-lg': !open,
                'bg-input-background text-input-text hover:border-primary': !disabled,
                'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': disabled
              },
              triggerClassName
            )}
            onClick={toggleOpen}
            disabled={disabled}
          >
            {!isShowingHint &&
              <span className="font-semibold">{selectedDisplayOverwrite ?? selectedOption?.label}</span>}
            {isShowingHint && (
              <span className={clsx('textstyle-description', hintTextClassName)}>
                {hintText}
              </span>
            )}
            <ExpansionIcon isExpanded={isOpen}/>
          </button>
        )}
        menuClassName={clsx('flex-col-2 p-2 max-h-96 overflow-hidden', menuProps.menuClassName)}
      >
        {(bag) => {
          const { close } = bag
          return (
            <>
              {!searchOptions?.disabled && (
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  autoFocus={true}
                />
              )}
              <div className="flex-col-2 overflow-y-auto">
                {result.map((option, index) => (
                  <ListTile
                    key={index}
                    isSelected={option === selectedOption}
                    title={option.label}
                    onClick={() => {
                      onChange(option.value)
                      close()
                    }}
                    disabled={option.disabled}
                  />
                ))}
                {additionalItems && additionalItems({ ...bag, search, selected: value })}
              </div>
            </>
          )
        }}
      </Menu>
    </div>
  )
}

export const SelectUncontrolled = <T, >({
                                          options, onChange, value, hintText, ...props
                                        }: SelectProps<T>) => {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    if (options.find(options => options.value === value)) {
      setSelected(value)
    }
  }, [options, value])

  return (
    <Select
      value={selected}
      options={options}
      onChange={value => {
        setSelected(value)
        onChange(value)
      }}
      hintText={hintText}
      {...props}
    />
  )
}