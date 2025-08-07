import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ExpansionIcon } from '../../layout-and-navigation/Expandable'
import { Popover } from 'radix-ui'
import { formTranslation } from '@/src/localization/defaults/form'
import { useTranslation } from '@/src/localization/useTranslation'
import { Input } from '@/src/components/user-action/input/Input'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { CheckIcon } from 'lucide-react'
import type { SelectOption } from '@/src/components/user-action/select/Select'

export type SearchableSelectOption = SelectOption & {
  keywords?: string[],
}

export type SearchableSelectBag = {
  selected: string,
  search: string,
}

export type SearchableSelectProps = {
  value?: string,
  options: SearchableSelectOption[],
  onChange: (value: string) => void,
  disabled?: boolean,
  noItemsElement?: ReactNode,
  placeholder?: string,
  additionalActions?: (bag: SearchableSelectBag) => ReactNode,
  triggerClassName?: string,
  contentClassName?: string,
};

/**
 * A Component for selecting a single item form a list of options that allows searching
 *
 * The State is managed by the parent
 */
export const SearchableSelect = ({
                                   value,
                                   options,
                                   onChange,
                                   noItemsElement,
                                   placeholder,
                                   additionalActions,
                                   triggerClassName,
                                   contentClassName,
                                 }: SearchableSelectProps) => {
  const translation = useTranslation([formTranslation])
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const selectedOption = options.find(option => option.value === value)
  useLogOnce(
    'The selected value is not found in the options list.',
    value !== undefined && selectedOption === undefined
  )

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <Popover.PopoverTrigger className="min-w-32" asChild>
        <button
          role="combobox"
          aria-expanded={isOpen}
          className={clsx(
            'flex-row-2 justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
            { 'text-description': !value },
            triggerClassName
          )}
        >
          {value
            ? selectedOption?.label ?? selectedOption?.value
            : placeholder ?? translation('select')}
          <ExpansionIcon isExpanded={isOpen}/>
        </button>
      </Popover.PopoverTrigger>
      <Popover.Portal>
        <Popover.PopoverContent
          className={clsx(
            'bg-menu-background text-menu-text p-2 rounded-md shadow-hw-bottom motion-safe:animate-pop-in',
            contentClassName
          )}
        >
          <Command className="flex-col-2">
            <CommandInput value={searchValue} onValueChange={setSearchValue} asChild>
              <Input editCompleteOptions={{ allowEnterComplete: false, onBlur: false, afterDelay: false }}/>
            </CommandInput>
            <CommandEmpty>
              {noItemsElement ?? (
                <div className="flex-col-0 justify-center items-center px-2 py-4">
                  {translation('nothingFound')}
                </div>
              )}
            </CommandEmpty>
            <CommandList>
              <CommandGroup className="flex-col-0.5">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={option.keywords}
                    disabled={option.disabled}
                    onSelect={(value) => {
                      onChange(value)
                      setIsOpen(false)
                    }}
                    className={clsx(
                      'flex-row-1 items-center px-2 py-1 rounded-md',
                      {
                        'text-disabled cursor-not-allowed': option.disabled,
                        'hover:bg-primary/20 data-[selected=true]:bg-primary/20 cursor-pointer': !option.disabled,
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
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {additionalActions?.({ selected: value, search: searchValue })}
          </Command>
        </Popover.PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  )
}

export const SearchableSelectUncontrolled = ({
                                               options, onChange, value: initialValue, noItemsElement, ...props
                                             }: SearchableSelectProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <SearchableSelect
      value={value}
      options={options}
      onChange={value => {
        setValue(value)
        onChange(value)
      }}
      noItemsElement={noItemsElement}
      {...props}
    />
  )
}