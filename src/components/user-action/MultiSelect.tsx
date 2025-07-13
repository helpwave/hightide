import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import type { SelectOption } from './Select'
import { SelectTile } from './Select'
import { SearchableList } from '../layout-and-navigation/SearchableList'
import { SolidButton } from './Button'
import { ChipList } from '../layout-and-navigation/Chip'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { MenuProps } from './Menu'
import { Menu } from './Menu'

type MultiSelectAddonTranslation = {
  selected: string,
}

type MultiSelectTranslation = MultiSelectAddonTranslation & FormTranslationType

const defaultMultiSelectTranslation: Translation<MultiSelectAddonTranslation> = {
  en: {
    selected: `{{amount}} selected`
  },
  de: {
    selected: `{{amount}} ausgewählt`
  }
}

export type MultiSelectOption<T> = SelectOption<T> & {
  selected: boolean,
}

export type MultiSelectProps<T> = Omit<MenuProps<HTMLButtonElement>, 'trigger' | 'children'> & {
  options: MultiSelectOption<T>[],
  label?: LabelProps,
  onChange: (options: MultiSelectOption<T>[]) => void,
  hintText?: string,
  isDisabled?: boolean,
  isSearchEnabled?: boolean,
  className?: string,
  useChipDisplay?: boolean,
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
                                   isSearchEnabled = false,
                                   selectedDisplayOverwrite,
                                   useChipDisplay = false,
                                   className = '',
                                   ...menuProps
                                 }:
                                 PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>
) => {
  const translation = useTranslation([formTranslation, defaultMultiSelectTranslation], overwriteTranslation)

  const selectedItems = options.filter(value => value.selected)

  const isShowingHint = !selectedDisplayOverwrite && selectedItems.length === 0

  return (
    <div className={clsx(className)}>
      {label && (
        <Label
          {...label}
          htmlFor={label.name}
          className={clsx(' mb-1', label.className)}
          labelType={label.labelType ?? 'labelBig'}
        />
      )}
      <Menu<HTMLButtonElement>
        {...menuProps}
        trigger={({ toggleOpen, isOpen, disabled }, ref) => (
          <button
            ref={ref}
            className={clsx(
              'btn-md justify-between w-full border-2 h-auto',
              {
                'rounded-b-lg': !open,
                'bg-menu-background text-menu-text border-menu-border hover:border-primary': !disabled,
                'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': disabled
              }
            )}
            onClick={toggleOpen}
            disabled={disabled}
          >
            {!isShowingHint && (
              <span className="font-semibold">
              {selectedDisplayOverwrite ?? (useChipDisplay && selectedItems ?
                  (<ChipList list={selectedItems.map(value => ({ children: value.label }))}/>) :
                  translation('selected', { replacements: { amount: selectedItems.length.toString() } })
              )}
            </span>
            )}
            {isShowingHint && (<span className="textstyle-description">{hintText ?? translation('select')}</span>)}
            {isOpen ? <ChevronUp size={24} className="min-w-6"/> : <ChevronDown className="min-w-6"/>}
          </button>
        )}
        menuClassName={clsx('flex-col-2 p-2 max-h-96', menuProps.menuClassName)}
      >
        {({ close }) => (
          <>
            <SearchableList
              autoFocus={true}
              list={options}
              minimumItemsForSearch={isSearchEnabled ? undefined : options.length}
              searchMapping={item => item.searchTags}
              itemMapper={(option, index) => (
                <SelectTile
                  key={index}
                  isSelected={option.selected}
                  title={{ value: option.label }}
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
                  {translation('all')}
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
                  {translation('none')}
                </SolidButton>
              </div>
              <SolidButton size="small" onClick={close}>Done</SolidButton>
            </div>
          </>
        )}
      </Menu>
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