import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { useSearch } from '@/src/hooks/useSearch'
import { CheckIcon, Plus } from 'lucide-react'
import type { PropsForTranslation, Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'
import type { FormTranslationType } from '@/src/localization/defaults/form'
import { formTranslation } from '@/src/localization/defaults/form'
import { ChipList } from '@/src/components/layout-and-navigation/Chip'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import { SearchBar } from '@/src/components/user-action/SearchBar'
import { SolidButton } from '@/src/components/user-action/Button'
import { Menu } from '@/src/components/user-action/Menu'
import type { SearchableSelectOption } from '@/src/components/user-action/select/SearchableSelect'

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

export type MultiSelectOption = SearchableSelectOption

export type MultiSelectBag = {
  search: string,
}


export type MultiSelectProps = Omit<MenuProps<HTMLButtonElement>, 'trigger' | 'children'> & {
  options: MultiSelectOption[],
  onChange: (options: MultiSelectOption[]) => void,
  hintText?: string,
  selectedDisplayOverwrite?: ReactNode,
  additionalItems?: (bag: MultiSelectBag) => ReactNode,
  useChipDisplay?: boolean,
  triggerClassName?: string,
  hintTextClassName?: string,
}

/**
 * A Component for multi selection
 */
export const MultiSelect = <T, >({
                                   overwriteTranslation,
                                   options,
                                   onChange,
                                   hintText,
                                   selectedDisplayOverwrite,
                                   searchOptions,
                                   additionalItems,
                                   useChipDisplay = false,
                                   triggerClassName,
                                   hintTextClassName,
                                   ...menuProps
                                 }:
                                 PropsForTranslation<MultiSelectTranslation, MultiSelectProps<T>>
) => {
  const translation = useTranslation([formTranslation, defaultMultiSelectTranslation], overwriteTranslation)
  const { result, search, setSearch } = useSearch<MultiSelectOption<T>>({
    list: options,
    searchMapping: useCallback((item: MultiSelectOption<T>) => item.keywords, []),
    ...searchOptions,
  })

  const selectedItems = options.filter(value => value.selected)

  const isShowingHint = !selectedDisplayOverwrite && selectedItems.length === 0

  return (
    <Menu<HTMLButtonElement>
      {...menuProps}
      trigger={({ toggleOpen, isOpen, disabled }, ref) => (
        <button
          ref={ref}
          className={clsx(
            'group btn-md justify-between w-full border-2 h-auto',
            'not-disabled:bg-input-background not-disabled:text-input-text not-disabled:hover:border-primary',
            'disabled:bg-disabled-background disabled:text-disabled-text disabled:border-disabled-border',
            {
              'min-h-14': useChipDisplay,
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
                <span className={clsx('text-description', hintTextClassName)}>
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
                  onChange(options.map(value => value.id === option.id ? ({
                    ...option,
                    selected: !value.selected
                  }) : value))
                }
                return (
                  <button
                    key={index}
                    disabled={option.disabled}
                    className={clsx(
                      'flex-row-2 items-center', {
                        'text-disabled': option.disabled,
                      }, option.className
                    )}
                    onClick={update}
                  >
                    <div aria-hidden={true} className="size-force-4">
                      {option.selected ? (<CheckIcon/>) : undefined}
                    </div>
                    <span>{option.label}</span>
                  </button>
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