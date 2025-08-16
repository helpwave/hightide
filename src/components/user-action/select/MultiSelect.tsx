import { type ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CheckIcon, Plus } from 'lucide-react'
import type { PropsForTranslation, Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'
import type { FormTranslationType } from '@/src/localization/defaults/form'
import { formTranslation } from '@/src/localization/defaults/form'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import { Chip } from '@/src/components/layout-and-navigation/Chip'
import type { ListBoxMultipleProps } from '@/src/components/layout-and-navigation/ListBox'
import type { FloatingContainerProps } from '@/src/components/layout-and-navigation/FloatingContainer'

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

export type MultiSelectProps = Omit<ListBoxMultipleProps, 'onSelectionChanged' | 'onChange'> &
  Pick<FloatingContainerProps, 'gap' | 'horizontalAlignment' | 'verticalAlignment'> &
  {
    value?: string,
    disabled?: boolean,
    onChange?: (value: string[]) => void,
    invalid?: boolean,
    placeholder?: ReactNode,
    useChipDisplay?: boolean,
    triggerClassName?: string,
    contentClassName?: string,
  };

/**
 * A Component for multi selection
 */
export const MultiSelect = ({
                              overwriteTranslation,
                              value = [],
                              options,
                              onChange,
                              placeholder,
                              useChipDisplay = false,
                              triggerClassName,
                              contentClassName,
                            }:
                            PropsForTranslation<MultiSelectTranslation, MultiSelectProps>) => {
  const translation = useTranslation([formTranslation, defaultMultiSelectTranslation], overwriteTranslation)
  const display = useChipDisplay ? (
    <div className="flex flex-wrap gap-2">
      {value.map((option, index) => (
        <Chip key={index}>{option}</Chip>
      ))}
      <Chip icon={true} key="add"><Plus/></Chip>
    </div>
  ) : (
    <span>{translation('selected', { replacements: { amount: value.length.toString() } })}</span>
  )

  const shownPlaceHolder = useChipDisplay ? (
    <div className="flex flex-wrap gap-2">
      <Chip icon={true} key="add"><Plus/></Chip>
    </div>
  ) : placeholder ?? (
    <span className="text-description">{`${translation('select')}...`}</span>
  )

  return (
    <Listbox value={value} onChange={onChange} multiple={true}>
      <ListboxButton
        className={clsx(
          'group flex-row-4 items-center justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
          triggerClassName
        )}
      >
        {value.length === 0 ? shownPlaceHolder : display}
        <ExpansionIcon className="group-data-[open]:rotate-180"/>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className={clsx(
          'flex-col-0 bg-menu-background text-menu-text rounded-md shadow-hw-bottom py-2 !overflow-y-hidden [--anchor-gap:8px]',
          contentClassName
        )}
      >
        <div className="flex-col-1 max-h-64 overflow-y-auto px-2">
          {options.map((option) => {
            const isSelected = value.find(value => value === option.value)
            return (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={clsx(
                  'flex-row-1 items-center px-2 py-1 rounded-md focus-style-none',
                  {
                    'text-disabled cursor-not-allowed': option.disabled,
                    'data-focus:bg-primary/20 cursor-pointer': !option.disabled,
                  },
                  option.className
                )}
              >
                <CheckIcon
                  className={clsx(
                    'size-force-4.5',
                    {
                      'opacity-100': isSelected,
                      'opacity-0': !isSelected,
                    }
                  )}
                  aria-hidden={true}
                />
                {option.label ?? option.value}
              </ListboxOption>
            )
          })}
        </div>
      </ListboxOptions>
    </Listbox>
  )
}

export const MultiSelectUncontrolled = ({
                                          value: initialValue,
                                          options,
                                          onChange,
                                          ...props
                                        }:
                                        PropsForTranslation<MultiSelectTranslation, MultiSelectProps>) => {
  const [value, setValue] = useState<string[]>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <MultiSelect
      {...props}
      value={value}
      options={options}
      onChange={value => {
        onChange?.(value)
        setValue(value)
      }}
    />
  )
}