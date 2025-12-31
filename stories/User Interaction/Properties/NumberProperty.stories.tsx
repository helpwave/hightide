import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { NumberProperty } from '../../../src/components/user-interaction/properties/NumberProperty'


const meta = {
  component: NumberProperty,
} satisfies Meta<typeof NumberProperty>

export default meta
type Story = StoryObj<typeof meta>;

export const numberProperty: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: undefined,
    suffix: 'kg',
    readOnly: false,
    className: '',
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<number | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <NumberProperty
        {...props}
        onChange={setUsedValue}
        onRemove={() => setUsedValue(undefined)}
        value={usedValue}
      />
    )
  }
}
