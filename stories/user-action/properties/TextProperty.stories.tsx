import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import type { TextPropertyProps } from '../../../src'
import { TextProperty } from '../../../src'

type TextPropertyExampleProps = Omit<TextPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean,
}

/**
 * Example for using the TextProperty
 */
const TextPropertyExample = ({
                               value,
                               ...restProps
                             }: TextPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <TextProperty
      {...restProps}
      onChange={setUsedValue}
      onRemove={() => setUsedValue(undefined)}
      value={usedValue}
    />
  )
}

const meta = {
  title: 'User Action/Property',
  component: TextPropertyExample,
} satisfies Meta<typeof TextPropertyExample>

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
}
