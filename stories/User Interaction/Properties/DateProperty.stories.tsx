import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { DateProperty } from '../../../src/components/user-interaction/properties/DateProperty'
import { action } from 'storybook/actions'

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
    onRemove: action('onRemove'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
  render: ({ value, ...props }) => {
    const [usedDate, setUsedDate] = useState<Date | undefined>(value)

    useEffect(() => {
      setUsedDate(value)
    }, [value])

    return (
      <DateProperty
        {...props}
        onValueChange={date => {
          setUsedDate(date)
          props.onValueChange?.(date)
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
