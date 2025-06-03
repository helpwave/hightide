import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import type { NumberPropertyProps } from '../../../src/components/properties/NumberProperty'
import { NumberProperty } from '../../../src/components/properties/NumberProperty'

type NumberPropertyExampleProps = Omit<NumberPropertyProps, 'onChange' | 'onRemove'>

/**
 * Example for using the NumberProperty
 */
const NumberPropertyExample = ({
                                        value,
                                        ...restProps
                                      }: NumberPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<number | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
      <NumberProperty
          {...restProps}
          onChange={setUsedValue}
          onRemove={() => setUsedValue(undefined)}
          value={usedValue}
      />
  )
}


const meta = {
  title: 'User Action/Property',
  component: NumberPropertyExample,
} satisfies Meta<typeof NumberPropertyExample>

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
}
