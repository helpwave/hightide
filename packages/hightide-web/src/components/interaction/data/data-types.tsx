import { Binary, Calendar, CalendarClock, Check, Database, Tag, Tags, TextIcon } from 'lucide-react'
import { Icon } from '../../visualization/Icon'
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
    return <Icon icon={TextIcon} size="xs" />
  case 'number':
    return <Icon icon={Binary} size="xs" />
  case 'boolean':
    return <Icon icon={Check} size="xs" />
  case 'date':
    return <Icon icon={Calendar} size="xs" />
  case 'dateTime':
    return <Icon icon={CalendarClock} size="xs" />
  case 'singleTag':
    return <Icon icon={Tag} size="xs" />
  case 'multiTags':
    return <Icon icon={Tags} size="xs" />
  case 'unknownType':
    return <Icon icon={Database} size="xs" />
  }
}

export const DataTypeUtils = {
  types: dataTypes,
  getDefaultValue,
  toIcon,
}