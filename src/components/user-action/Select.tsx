import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import { SearchableList } from '../layout-and-navigation/SearchableList'
import { Tile } from '../layout-and-navigation/Tile'

export type SelectOption<T> = {
  label: ReactNode,
  value: T,
  searchTags?: string[],
  disabled?: boolean,
  className?: string,
}

export type SelectProps<T> = {
  value?: T,
  label?: LabelProps,
  options: SelectOption<T>[],
  onChange: (value: T) => void,
  hintText?: string,
  isDisabled?: boolean,
  isSearchEnabled?: boolean,
  selectedDisplayOverwrite?: ReactNode,
  className?: string,
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
                              isDisabled,
                              isSearchEnabled = false,
                              className,
                              selectedDisplayOverwrite,
                            }: SelectProps<T>) => {
  const [isOpen, setOpen] = useState(false)
  const selectedOption = options.find(option => option.value === value)
  if (value !== undefined && selectedOption === undefined && selectedDisplayOverwrite === undefined) {
    console.warn('The selected value is not found in the options list. This might be an error on your part or' +
      ' default behavior if it is complex data type on which === does not work. In case of the latter' +
      ' use selectedDisplayOverwrite to set your selected text or component')
  }

  const isShowingHint = !selectedDisplayOverwrite && !selectedOption?.label

  return (
    <div className={clsx(className)}>
      {label && (
        <Label {...label} labelType={label.labelType ?? 'labelBig'} className={clsx('mb-1', label.className)}/>
      )}
      <div className="relative">
        <button
          className={clsx(
            'btn-md justify-between w-full border-2',
            {
              'rounded-b-lg': !open,
              'bg-menu-background border-menu-border hover:border-primary': !isDisabled,
              'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': isDisabled
            }
          )}
          onClick={() => setOpen(!isOpen)}
          disabled={isDisabled}
        >
          {!isShowingHint && <span className="font-semibold text-menu-text">{selectedDisplayOverwrite ?? selectedOption?.label}</span>}
          {isShowingHint && (<span className="textstyle-description">{hintText}</span>)}
          {isOpen ? <ChevronUp/> : <ChevronDown/>}
        </button>
        {isOpen && (
          <div
            className="absolute w-full z-10 rounded-lg mt-0.5 bg-menu-background text-menu-text shadow-lg max-h-[500px] overflow-y-auto p-2">
            <SearchableList
              list={options}
              minimumItemsForSearch={isSearchEnabled ? undefined : options.length}
              searchMapping={item => item.searchTags}
              itemMapper={(option, index) => (
                <Tile
                  key={index}
                  isSelected={selectedOption?.value === option.value}
                  className="px-2 py-1 rounded-md"
                  disabledClassName="text-disabled-text cursor-not-allowed"
                  title={{ value: option.label, className: 'font-semibold' }}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  isDisabled={option.disabled}
                />
              )}
            />
          </div>
        )}
      </div>
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