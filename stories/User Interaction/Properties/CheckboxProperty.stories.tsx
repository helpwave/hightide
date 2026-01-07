import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { CheckboxProperty } from '../../../src/components/user-interaction/properties/CheckboxProperty'
import { action } from 'storybook/actions'

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
    onRemove: action('onRemove'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<boolean | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <CheckboxProperty
        {...props}
        onValueChange={setUsedValue}
        value={usedValue}
      />
    )
  }
}
