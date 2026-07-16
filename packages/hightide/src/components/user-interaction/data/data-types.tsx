import { Binary, Calendar, CalendarClock, Check, Database, Tag, Tags, TextIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const dataTypes = [
  'text',
  'number',
  'date',
  'dateTime',
  'boolean',
  'singleTag',
  'multiTags',
  'unknownType',
] as const
export type DataType = (typeof dataTypes)[number]

export interface DataValue {
  textValue?: string,
  numberValue?: number,
  booleanValue?: boolean,
  dateValue?: Date,
  singleSelectValue?: string,
  multiSelectValue?: string[],
}

const getDefaultValue = (type: DataType, selectOptions?: string[]): DataValue => {
  switch (type) {
  case 'text':
    return { textValue: '' }
  case 'number':
    return { numberValue: 0 }
  case 'boolean':
    return { booleanValue: false }
  case 'date':
  case 'dateTime':
    return { dateValue: new Date() }
  case 'singleTag':
    return { singleSelectValue: selectOptions?.[0] }
  case 'multiTags':
    return { multiSelectValue: [] }
  default:
    return {}
  }
}

function toIcon(type: DataType): ReactNode {
  switch (type) {
  case 'text':
    return <TextIcon className="size-4" />
  case 'number':
    return <Binary className="size-4" />
  case 'boolean':
    return <Check className="size-4" />
  case 'date':
    return <Calendar className="size-4" />
  case 'dateTime':
    return <CalendarClock className="size-4" />
  case 'singleTag':
    return <Tag className="size-4" />
  case 'multiTags':
    return <Tags className="size-4" />
  case 'unknownType':
    return <Database className="size-4" />
  }
}

export const DataTypeUtils = {
  types: dataTypes,
  getDefaultValue,
  toIcon,
}