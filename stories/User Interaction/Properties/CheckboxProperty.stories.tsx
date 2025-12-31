import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { CheckboxProperty } from '../../../src/components/user-interaction/properties/CheckboxProperty'

const meta = {
  component: CheckboxProperty,
} satisfies Meta<typeof CheckboxProperty>

export default meta
type Story = StoryObj<typeof meta>;

export const checkboxProperty: Story = {
  args: {
    value: undefined,
    name: 'Property',
    softRequired: false,
    readOnly: false,
    className: '',
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<boolean | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <CheckboxProperty
        {...props}
        onChange={setUsedValue}
        value={usedValue}
      />
    )
  }
}
