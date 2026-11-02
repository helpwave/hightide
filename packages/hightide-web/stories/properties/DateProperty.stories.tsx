import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { DateProperty } from '../../src/components/properties/DateProperty'
import { action } from 'storybook/actions'

const meta: Meta<typeof DateProperty> = {
  component: DateProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const dateProperty: Story = {
  args: {
    name: 'Property',
    isRequired: false,
    value: null,
    isReadOnly: false,
    type: 'dateTime',
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedDate, setUsedDate] = useState<Date | null>(value ?? null)

    useEffect(() => {
      setUsedDate(value ?? null)
    }, [value])

    return (
      <DateProperty
        {...props}
        value={usedDate}
        onValueChange={(date) => {
          props.onValueChange?.(date)
          setUsedDate(date)
        }}
        onStateEvent={(event) => {
          props.onStateEvent?.(event)
          if (event.type === 'commit') setUsedDate(event.value)
        }}
        onValueClear={() => {
          props.onValueClear?.()
          setUsedDate(null)
        }}
      />
    )
  }
}
