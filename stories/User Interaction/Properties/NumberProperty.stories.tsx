import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { NumberProperty } from '@/src/components/user-interaction/properties/NumberProperty'
import { action } from 'storybook/actions'

const meta: Meta<typeof NumberProperty> = {
  component: NumberProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const numberProperty: Story = {
  args: {
    name: 'Property',
    required: false,
    value: undefined,
    suffix: 'kg',
    readOnly: false,
    className: '',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<number | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <NumberProperty
        {...props}
        value={usedValue}
        onValueChange={(val) => {
          props.onValueChange?.(val)
          setUsedValue(val)
        }}
        onEditComplete={(val) => {
          props.onEditComplete?.(val)
          setUsedValue(val)
        }}
        onValueClear={() => {
          props.onValueClear?.()
          setUsedValue(undefined)
        }}
      />
    )
  }
}
