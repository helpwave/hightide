import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import type { CheckboxPropertyProps } from '../../../src/components/properties/CheckboxProperty'
import { CheckboxProperty } from '../../../src/components/properties/CheckboxProperty'

type CheckboxPropertyExampleProps = Omit<CheckboxPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean,
}

/**
 * Example for using the CheckboxProperty
 */
const CheckboxPropertyExample = ({
                                   value = false,
                                   ...restProps
                                 }: CheckboxPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<boolean>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <CheckboxProperty
      {...restProps}
      onChange={setUsedValue}
      value={usedValue}
    />
  )
}

const meta = {
  title: 'User Action/Property',
  component: CheckboxPropertyExample,
} satisfies Meta<typeof CheckboxPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const checkboxProperty: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    value: false,
    readOnly: false,
    className: '',
  },
}
