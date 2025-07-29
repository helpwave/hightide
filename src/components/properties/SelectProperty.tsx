import { List, Plus } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { SelectProps } from '../user-action/Select'
import { Select } from '../user-action/Select'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import { ListTile } from '../layout-and-navigation/Tile'

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
          className={clsx('w-full')}
          placeholder={`${translation('select')}...`}
          searchOptions={{
            sortingFunction: (a, b) => a.value.localeCompare(b.value),
            ...selectProps?.searchOptions
          }}
          additionalItems={({ close, search }) => {
            if (!onAddNew && !search.trim()) {
              return undefined
            }
            return (
              <ListTile
                prefix={(<Plus/>)}
                title={`${translation('add')} ${search.trim()}`}
                onClick={() => {
                  onAddNew(search)
                  close()
                }}
                disabled={options.some(value => value.value === search.trim())}
              />
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
