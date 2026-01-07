import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { DateProperty } from '@/src/components/user-interaction/properties/DateProperty'
import { action } from 'storybook/actions'

const meta: Meta<typeof DateProperty> = {
  component: DateProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const dateProperty: Story = {
  args: {
    name: 'Property',
    required: false,
    value: undefined,
    readOnly: false,
    type: 'dateTime',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedDate, setUsedDate] = useState<Date | undefined>(value)

    useEffect(() => {
      setUsedDate(value)
    }, [value])

    return (
      <DateProperty
        {...props}
        value={usedDate}
        onValueChange={(date) => {
          props.onValueChange?.(date)
          setUsedDate(date)
        }}
        onEditComplete={(date) => {
          props.onEditComplete?.(date)
          setUsedDate(date)
        }}
        onValueClear={() => {
          props.onValueClear?.()
          setUsedDate(undefined)
        }}
      />
    )
  }
}
