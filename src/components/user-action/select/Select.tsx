import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { formTranslation } from '@/src/localization/defaults/form'
import { useTranslation } from '@/src/localization/useTranslation'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import type {
  ListboxOptionsProps } from '@headlessui/react'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import { CheckIcon } from 'lucide-react'

export type SelectOption = {
  /**
   * The value of the option
   *
   * Must be unique among all options.
   */
  value: string,
  /**
   * The visualization representation of the value, if omitted the value is used directly
   */
  label?: ReactNode,
  disabled?: boolean,
  className?: string,
}

export type SelectProps = Pick<ListboxOptionsProps, 'anchor'> & {
  value?: string,
  options: SelectOption[],
  onChange?: (value: string) => void,
  disabled?: boolean,
  placeholder?: string,
  triggerClassName?: string,
  contentClassName?: string,
};

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = ({
                         value,
                         options,
                         onChange,
                         placeholder,
                         triggerClassName,
                         contentClassName,
                       }: SelectProps) => {
  const translation = useTranslation([formTranslation])

  const selectedOption = options.find(option => option.value === value)
  useLogOnce(
    'The selected value is not found in the options list.',
    value !== undefined && selectedOption === undefined
  )

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={clsx(
          'group flex-row-4 items-center justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
          'data-placeholder:text-description',
          triggerClassName
        )}
        data-placeholder={!value ? '' : undefined}
      >
        {selectedOption?.label ?? selectedOption?.value ?? placeholder ?? `${translation('select')}...`}
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
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={clsx(
                'flex-row-1 items-center px-2 py-1 rounded-md no-focus-style',
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
                    'opacity-100': option.value === value,
                    'opacity-0': option.value !== value,
                  }
                )}
                aria-hidden={true}
              />
              {option.label ?? option.value}
            </ListboxOption>
          ))}
        </div>
      </ListboxOptions>
    </Listbox>
  )
}

export const SelectUncontrolled = ({
                                     options, onChange, value: initialValue, ...props
                                   }: SelectProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Select
      value={value}
      options={options}
      onChange={value => {
        onChange?.(value)
        setValue(value)
      }}
      {...props}
    />
  )
}