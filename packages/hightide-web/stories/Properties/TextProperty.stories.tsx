import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { TextProperty } from '../../src/components/properties/TextProperty'
import { action } from 'storybook/actions'

const meta: Meta<typeof TextProperty> = {
  component: TextProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const textProperty: Story = {
  args: {
    name: 'Property',
    isRequired: false,
    value: '',
    isReadOnly: false,
    className: '',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState(value ?? '')

    useEffect(() => {
      setUsedValue(value ?? '')
    }, [value])

    return (
      <TextProperty
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
          setUsedValue('')
        }}
      />
    )
  }
}
