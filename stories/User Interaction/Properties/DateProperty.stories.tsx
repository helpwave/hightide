import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { DateProperty } from '../../../src/components/user-interaction/properties/DateProperty'

const meta = {
  component: DateProperty,
} satisfies Meta<typeof DateProperty>

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
  render: ({ value, ...props }) => {
    const [usedDate, setUsedDate] = useState<Date | undefined>(value)

    useEffect(() => {
      setUsedDate(value)
    }, [value])

    return (
      <DateProperty
        {...props}
        onChange={date => {
          setUsedDate(date)
          props.onChange?.(date)
        }}
        onEditComplete={date => {
          setUsedDate(date)
          props.onEditComplete?.(date)
        }}
        onRemove={() => {
          setUsedDate(undefined)
          props.onRemove?.()
        }}
        value={usedDate}
      />
    )
  }
}
