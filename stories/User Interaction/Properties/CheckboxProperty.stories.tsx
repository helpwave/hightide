import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { CheckboxProperty } from '@/src/components/user-interaction/properties/CheckboxProperty'
import { action } from 'storybook/actions'

const meta: Meta<typeof CheckboxProperty> = {
  component: CheckboxProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const checkboxProperty: Story = {
  args: {
    name: 'Property',
    required: false,
    value: undefined,
    readOnly: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<boolean | undefined>(value)

    useEffect(() => {
      setUsedValue(value)
    }, [value])

    return (
      <CheckboxProperty
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
