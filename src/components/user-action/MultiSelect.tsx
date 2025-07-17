import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import type { SelectOption } from './Select'
import { SolidButton } from './Button'
import { ChipList } from '../layout-and-navigation/Chip'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { MenuBag, MenuProps } from './Menu'
import { Menu } from './Menu'
import { ExpansionIcon } from '../layout-and-navigation/Expandable'
import { SearchBar } from './SearchBar'
import type { UseSearchProps } from '../../hooks/useSearch'
import { useSearch } from '../../hooks/useSearch'
import { Checkbox } from './Checkbox'
import { Plus } from 'lucide-react'
import { ListTile } from '../layout-and-navigation/Tile'

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

export type MultiSelectBag = MenuBag & {
  search: string,
}


export type MultiSelectProps<T> = Omit<MenuProps<HTMLButtonElement>, 'trigger' | 'children'> & {
  options: MultiSelectOption<T>[],
  label?: LabelProps,
  onChange: (options: MultiSelectOption<T>[]) => void,
  hintText?: string,
  selectedDisplayOverwrite?: ReactNode,
  searchOptions?: Omit<UseSearchProps<SelectOption<T>>, 'list' | 'searchMapping'>,
  additionalItems?: (bag: MultiSelectBag) => ReactNode,
  useChipDisplay?: boolean,
  className?: string,
  triggerClassName?: string,
  hintTextClassName?: string,
}

/**
 * A Component for multi selection
 */
export const MultiSelect = <T, >({
                                   overwriteTranslation,
                                   label,
                                   options,
                                   onChange,
                                   hintText,
                                   selectedDisplayOverwrite,
                                   searchOptions,
                                   additionalItems,
                                   useChipDisplay = false,
                                   className,
                                   triggerClassName,
                                   hintTextClassName,
                                   ...menuProps
                                 }:
                                 PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>
) => {
  const translation = useTranslation([formTranslation, defaultMultiSelectTranslation], overwriteTranslation)
  const { result, search, setSearch } = useSearch<MultiSelectOption<T>>({
    list: options,
    searchMapping: useCallback((item: MultiSelectOption<T>) => item.searchTags, []),
    ...searchOptions,
  })

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
              'group btn-md justify-between w-full border-2 h-auto',
              {
                'min-h-14': useChipDisplay,
                'bg-input-background text-input-text hover:border-primary': !disabled,
                'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': disabled
              },
              triggerClassName
            )}
            onClick={toggleOpen}
            disabled={disabled}
          >
            {useChipDisplay ? (
              <>
                {isShowingHint ? (
                  <div
                    className={clsx('icon-btn-sm ',
                      {
                        'bg-button-solid-neutral-background text-button-solid-neutral-text hover:brightness-90 group-hover:brightness-90': !disabled,
                        'bg-disabled-background text-disabled-text': disabled,
                      })}
                  >
                    <Plus/>
                  </div>
                ) : (
                  <ChipList list={selectedItems.map(value => ({ children: value.label }))}/>
                )}
              </>
            ) : (
              <>
                {!isShowingHint && (
                  <span className="font-semibold">
                    {selectedDisplayOverwrite ?? translation('selected', { replacements: { amount: selectedItems.length.toString() } })}
                  </span>
                )}
                {isShowingHint && (
                  <span className={clsx('textstyle-description', hintTextClassName)}>
                    {hintText ?? translation('select')}
                  </span>
                )}
                <ExpansionIcon isExpanded={isOpen}/>
              </>
            )}
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
                {result.map((option, index) => {
                  const update = () => {
                    onChange(options.map(value => value.value === option.value ? ({
                      ...option,
                      selected: !value.selected
                    }) : value))
                  }
                  return (
                    <ListTile
                      key={index}
                      prefix={(
                        <Checkbox
                          checked={option.selected}
                          onChange={update} size="small"
                          disabled={option.disabled}
                        />
                      )}
                      title={option.label}
                      onClick={update}
                      disabled={option.disabled}
                    />
                  )
                })}
                {additionalItems && additionalItems({ ...bag, search })}
              </div>
              <div className="flex-row-2 justify-between">
                <div className="flex-row-2">
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
          )
        }}
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