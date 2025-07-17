import { List, Plus } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { MultiSelectProps } from '../user-action/MultiSelect'
import { MultiSelect } from '../user-action/MultiSelect'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import { ListTile } from '../layout-and-navigation/Tile'

type TranslationType = FormTranslationType

export type MultiSelectPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'> &
  Omit<MultiSelectProps<string>, 'className' | 'disabled' | 'label'> & {
  onAddNew?: (value: string) => void,
}

/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = ({
                                      overwriteTranslation,
                                      options,
                                      name,
                                      readOnly = false,
                                      softRequired,
                                      onRemove,
                                      onAddNew,
                                      ...multiSelectProps
                                    }: PropsForTranslation<TranslationType, MultiSelectPropertyProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  const hasValue = options.some(value => value.selected)

  return (
    <PropertyBase
      name={name}
      onRemove={onRemove}
      readOnly={readOnly}
      softRequired={softRequired}
      hasValue={hasValue}
      icon={<List size={24}/>}
      input={({ softRequired }) => (
        <MultiSelect
          {...multiSelectProps}
          className={clsx('w-full', { 'bg-surface-warning': softRequired && !hasValue })}
          options={options}
          disabled={readOnly}
          useChipDisplay={true}
          hintText={`${translation('select')}...`}
          searchOptions={{
            sortingFunction: (a, b) => a.value.localeCompare(b.value),
            ...multiSelectProps?.searchOptions
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
            '!border-none !p-0 !min-h-10',
            {
              '!bg-warning !text-surface-warning': softRequired && !hasValue,
              '': !softRequired || hasValue,
            }
          )}
        />
      )}
    />
  )
}
