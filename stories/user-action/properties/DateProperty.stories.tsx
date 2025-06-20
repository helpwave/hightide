import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import type { DatePropertyProps } from '../../../src'
import { DateProperty } from '../../../src'
import { noop } from '../../../src'

type DatePropertyExampleProps = DatePropertyProps & {
  readOnly: boolean,
}

/**
 * Example for using the DateProperty
 */
const DatePropertyExample = ({
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

const meta = {
  title: 'User Action/Property',
  component: DatePropertyExample,
} satisfies Meta<typeof DatePropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const dateProperty: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: undefined,
    readOnly: false,
    type: 'dateTime',
    className: '',
  },
}
