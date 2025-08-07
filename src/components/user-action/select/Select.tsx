import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Select as SelectPrimitive } from 'radix-ui'
import { formTranslation } from '@/src/localization/defaults/form'
import { useTranslation } from '@/src/localization/useTranslation'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'

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

export type SelectProps = {
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
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(option => option.value === value)
  useLogOnce(
    'The selected value is not found in the options list.',
    value !== undefined && selectedOption === undefined
  )

  return (
    <SelectPrimitive.Root onValueChange={onChange} value={value} open={true} onOpenChange={setIsOpen}>
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
            'flex-col-0 bg-menu-background text-menu-text shadow-hw-bottom rounded-md max-h-64 no-focus-style',
            contentClassName
          )}
          position="popper"
        >
          <SelectPrimitive.ScrollUpButton className="flex-row-0 justify-center p-1 m-2 mb-0 rounded-md hover:bg-primary/20">
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
          <SelectPrimitive.ScrollDownButton className="flex-row-0 justify-center p-1 m-2 mt-0 rounded-md hover:bg-primary/20">
            <ChevronDownIcon size={18}/>
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
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