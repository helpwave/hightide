import { forwardRef, type ReactNode } from 'react'
import type { DataType } from '../data-types'
import type { FilterPopUpProps } from './FilterPopUpProps'
import { TextFilterPopUp } from './TextFilterPopUp'
import { NumberFilterPopUp } from './NumberFilterPopUp'
import { DateFilterPopUp } from './DateFilterPopUp'
import { DatetimeFilterPopUp } from './DatetimeFilterPopUp'
import { BooleanFilterPopUp } from './BooleanFilterPopUp'
import { TagsFilterPopUp } from './TagsFilterPopUp'
import { TagsSingleFilterPopUp } from './TagsSingleFilterPopUp'
import { GenericFilterPopUp } from './GenericFilterPopUp'

export interface DataTypeFilterPopUpProps extends FilterPopUpProps {
  dataType: DataType,
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export const FilterPopUp = forwardRef<HTMLDivElement, DataTypeFilterPopUpProps>(function FilterPopUp({
  name,
  value,
  onValueChange,
  dataType,
  tags,
  ...props
}, ref) {
  switch (dataType) {
  case 'text':
    return <TextFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'number':
    return <NumberFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'date':
    return <DateFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'dateTime':
    return <DatetimeFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'boolean':
    return <BooleanFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'multiTags':
    return <TagsFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} tags={tags} {...props} />
  case 'singleTag':
    return <TagsSingleFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} tags={tags} {...props} />
  case 'unknownType':
    return <GenericFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  }
})
