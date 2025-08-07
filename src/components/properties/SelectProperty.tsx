import { List, Plus } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { SelectProps } from '../user-action/select/Select'
import { Select } from '../user-action/select/Select'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type SingleSelectPropertyTranslation = FormTranslationType

export type SingleSelectPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'> &
  Omit<SelectProps<string>, 'className' | 'disabled' | 'label'> & {
  onAddNew?: (value: string) => void,
}

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = ({
                                       overwriteTranslation,
                                       value,
                                       options,
                                       name,
                                       readOnly = false,
                                       softRequired,
                                       onRemove,
                                       onAddNew,
                                       ...selectProps
                                     }: PropsForTranslation<SingleSelectPropertyTranslation, SingleSelectPropertyProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      name={name}
      onRemove={onRemove}
      readOnly={readOnly}
      softRequired={softRequired}
      hasValue={hasValue}
      icon={<List size={24}/>}
      input={({ softRequired }) => (
        <Select
          {...selectProps}
          value={value}
          options={options}
          disabled={readOnly}
          searchOptions={{
            sortingFunction: (a, b) => a.value.localeCompare(b.value),
            ...selectProps?.searchOptions
          }}
          additionalItems={({ close, search }) => {
            if (!onAddNew && !search.trim()) {
              return undefined
            }
            const disabled = options.some(value => value.id === search.trim())
            return (
              <button
                key="add new"
                disabled={disabled}
                className={clsx(
                  'flex-row-2 items-center', {
                    'text-disabled': disabled,
                  }
                )}
                onClick={() => {
                  onAddNew(search)
                  close()
                }}
              >
                <div aria-hidden={true} className="size-force-4">
                  <Plus/>
                </div>
                <span>{`${translation('add')} ${search.trim()}`}</span>
              </button>
            )
          }}
          triggerClassName={clsx(
            '!border-none',
            {
              '!bg-warning !text-surface-warning': softRequired && !hasValue,
              '!bg-property-title-background': !softRequired || hasValue,
            }
          )}
          hintTextClassName={(softRequired && !hasValue) ? 'text-surface-warning' : undefined}
        />
      )}
    />
  )
}
