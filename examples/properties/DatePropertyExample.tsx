import { useEffect, useState } from 'react'
import type { DatePropertyProps } from '../../src/components/properties/DateProperty'
import { DateProperty } from '../../src/components/properties/DateProperty'
import { noop } from '../../src/util/noop'

export type DatePropertyExampleProps = DatePropertyProps & {
  readOnly: boolean,
}

/**
 * Example for using the DateProperty
 */
export const DatePropertyExample = ({
  value,
  onChange = noop,
  onRemove = noop,
  onEditComplete = noop,
  ...restProps
}: DatePropertyExampleProps) => {
  const [usedDate, setUsedDate] = useState<Date | undefined>(value)

  useEffect(() => {
    setUsedDate(value)
  }, [value])

  return (
    <DateProperty
      {...restProps}
      onChange={date => {
        setUsedDate(date)
        onChange(date)
      }}
      onEditComplete={date => {
        setUsedDate(date)
        onEditComplete(date)
      }}
      onRemove={() => {
        setUsedDate(undefined)
        onRemove()
      }}
      value={usedDate}
    />
  )
}
