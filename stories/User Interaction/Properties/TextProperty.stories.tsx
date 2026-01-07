import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { TextProperty } from '@/src/components/user-interaction/properties/TextProperty'

const meta = {
  component: TextProperty,
} satisfies Meta<typeof TextProperty>

export default meta
type Story = StoryObj<typeof meta>;

export const textProperty: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: undefined,
    readOnly: false,
    className: '',
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<string | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <TextProperty
        {...props}
        onChange={setUsedValue}
        onRemove={() => setUsedValue(undefined)}
        value={usedValue}
      />
    )
  }
}
