import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { Language } from '../../localization/util'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import type { SelectOption } from './Select'
import { SearchableList } from '../layout-and-navigation/SearchableList'
import { Tile } from '../layout-and-navigation/Tile'
import { SolidButton } from './Button'
import { ChipList } from '../layout-and-navigation/Chip'
import { useOutsideClick } from '../../hooks/useOutsideClick'

type MultiSelectTranslation = {
  select: string,
  search: string,
  selected: string,
}

const defaultMultiSelectTranslation: Record<Language, MultiSelectTranslation> = {
  en: {
    select: 'Select',
    search: 'Search',
    selected: 'selected'
  },
  de: {
    select: 'Auswählen',
    search: 'Suche',
    selected: 'ausgewählt'
  }
}

export type MultiSelectOption<T> = SelectOption<T> & {
  selected: boolean,
}

export type SearchProps<T> = {
  initialSearch?: string,
  searchMapping: (value: MultiSelectOption<T>) => string[],
}

export type MultiSelectProps<T> = {
  options: MultiSelectOption<T>[],
  label?: LabelProps,
  onChange: (options: MultiSelectOption<T>[]) => void,
  hintText?: string,
  isDisabled?: boolean,
  isSearchEnabled?: boolean,
  className?: string,
  useChipDisplay: boolean,
  selectedDisplayOverwrite?: ReactNode,
}

/**
 * A Component for multi selection
 */
export const MultiSelect = <T, >({
                                   overwriteTranslation,
                                   options,
                                   label,
                                   onChange,
                                   hintText,
                                   isDisabled = false,
                                   isSearchEnabled = false,
                                   selectedDisplayOverwrite,
                                   useChipDisplay = false,
                                   className = '',
                                 }:
                                 PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>
) => {
  const translation = useTranslation(defaultMultiSelectTranslation, overwriteTranslation)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))

  const selectedItems = options.filter(value => value.selected)

  const isShowingHint = !selectedDisplayOverwrite && selectedItems.length === 0

  return (
    <div className={clsx(className)}>
      {label && (
        <Label {...label} htmlFor={label.name} className={clsx(' mb-1', label.className)}
               labelType={label.labelType ?? 'labelBig'}/>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          className={clsx(
            'btn-md justify-between w-full border-2 h-auto',
            {
              'rounded-b-lg': !open,
              'bg-menu-background border-menu-border hover:border-primary': !isDisabled,
              'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': isDisabled
            }
          )}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isDisabled}
        >
          {!isShowingHint && (
            <span className="font-semibold text-menu-text">
              {selectedDisplayOverwrite ?? (useChipDisplay && selectedItems ?
                  (<ChipList list={selectedItems.map(value => ({ children: value.label }))}/>) :
                  `${selectedItems.length} ${translation.selected}`
              )}
            </span>
          )}
          {isShowingHint && (<span className="textstyle-description">{hintText ?? translation.select}</span>)}
          {isOpen ? <ChevronUp size={24} className="min-w-6"/> : <ChevronDown className="min-w-6"/>}
        </button>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute w-full z-10 rounded-lg mt-0.5 bg-menu-background text-menu-text shadow-around-md max-h-[500px] overflow-y-auto p-2"
          >
            <SearchableList
              list={options}
              minimumItemsForSearch={isSearchEnabled ? undefined : options.length}
              searchMapping={item => item.searchTags}
              itemMapper={(option, index) => (
                <Tile
                  key={index}
                  isSelected={option.selected}
                  className="px-2 py-1 rounded-md"
                  disabledClassName="text-disabled-text cursor-not-allowed"
                  title={{ value: option.label, className: 'font-semibold' }}
                  onClick={() => {
                    onChange(options.map(value => value.value === option.value ? ({
                      ...option,
                      selected: !value.selected
                    }) : value))
                  }}
                  isDisabled={option.disabled}
                />
              )}
            />
            <div className="row justify-between mt-2">
              <div className="row gap-x-2">
                <SolidButton
                  color="neutral"
                  size="small"
                  onClick={() => {
                    onChange(options.map(option => ({
                      ...option,
                      selected: !option.disabled
                    })))
                  }}
                  disabled={options.every(value => value.selected || value.disabled)}
                >
                  All
                </SolidButton>
                <SolidButton
                  color="neutral"
                  size="small"
                  onClick={() => {
                    onChange(options.map(option => ({
                      ...option,
                      selected: false
                    })))
                  }}
                >
                  None
                </SolidButton>
              </div>
              <SolidButton size="small" onClick={() => setIsOpen(false)}>Done</SolidButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const MultiSelectUncontrolled = <T, >({
                                               options,
                                               onChange,
                                               ...props
                                             }:
                                             PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>) => {
  const [usedOptions, setUsedOptions] = useState<MultiSelectOption<T>[]>(options)

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  return (
    <MultiSelect
      {...props}
      options={usedOptions}
      onChange={options => {
        setUsedOptions(options)
        onChange(options)
      }}
    />
  )
}