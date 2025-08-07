import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import type { PropsForTranslation, Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'
import type { FormTranslationType } from '@/src/localization/defaults/form'
import { formTranslation } from '@/src/localization/defaults/form'
import type { SelectOption } from '@/src/components/user-action/select/Select'
import type { MenuBag } from '@/src/components/user-action/Menu'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import { Select as SelectPrimitive } from 'radix-ui'

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

export type MultiSelectOption = SelectOption

export type MultiSelectBag = MenuBag & {
  search: string,
}


export type MultiSelectProps = {
  value?: string[],
  options: SelectOption[],
  onChange?: (value: string[]) => void,
  disabled?: boolean,
  placeholder?: string,
  useChipDisplay?: boolean,
  triggerClassName?: string,
  contentClassName?: string,
}

/**
 * A Component for multi selection
 */
export const MultiSelect = ({
                              overwriteTranslation,
                              value = [],
                              options,
                              onChange,
                              placeholder,
                              additionalItems,
                              useChipDisplay = false,
                              triggerClassName,
                              ...menuProps
                            }:
                            PropsForTranslation<MultiSelectTranslation, MultiSelectProps>) => {
  const translation = useTranslation([formTranslation, defaultMultiSelectTranslation], overwriteTranslation)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SelectPrimitive.Root onValueChange={onChange} value={value} open={isOpen} onOpenChange={setIsOpen}>
      <SelectPrimitive.Trigger asChild>
        <button
          role="combobox"
          aria-expanded={isOpen}
          className={clsx(
            'flex-row-4 justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
            'data-placeholder:text-description',
            triggerClassName
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder ?? `${translation('select')}...`}>
            {selectedOption?.label ?? <span>{selectedOption?.value}</span>}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon className="SelectIcon">
            <ExpansionIcon isExpanded={isOpen}/>
          </SelectPrimitive.Icon>
        </button>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={clsx(
            'flex-col-2 bg-menu-background text-menu-text shadow-hw-bottom rounded-md no-focus-style',
            contentClassName
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex-row-0 justify-center p-2 m-2 rounded-md hover:bg-primary/20">
            <ChevronUpIcon size={18}/>
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="flex-col-0.5 p-2">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={clsx(
                  'flex-row-1 items-center px-2 py-1 rounded-md no-focus-style',
                  {
                    'text-disabled cursor-not-allowed': option.disabled,
                    'hover:bg-primary/20 data-highlighted:bg-primary/20 cursor-pointer': !option.disabled,
                  },
                  option.className
                )}
              >
                <CheckIcon
                  className={clsx(
                    'size-force-4.5',
                    {
                      'opacity-100': option.value === value,
                      'opacity-0': option.value !== value,
                    }
                  )}
                  aria-hidden={true}
                />
                <SelectPrimitive.ItemText>{option.label ?? option.value}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex-row-0 justify-center m-2 rounded-md hover:bg-primary/20">
            <ChevronDownIcon size={18}/>
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
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