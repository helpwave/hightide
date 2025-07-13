import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import type { SingleSelectPropertyProps } from '../../../src'
import { SingleSelectProperty } from '../../../src'

type SingleSelectPropertyExample = Omit<SingleSelectPropertyProps<string>, 'onChange' | 'onRemove' | 'searchMapping'>

/**
 * Example for using the SingleSelectProperty
 */
const SingleSelectPropertyExample = ({
                                       value,
                                       options,
                                       hintText,
                                       ...restProps
                                     }: SingleSelectPropertyExample) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  useEffect(() => {
    setUsedValue(undefined)
  }, [hintText])

  useEffect(() => {
    if (options.find(value1 => value1.value === value)) {
      setUsedValue(value)
    }
  }, [value, options])

  return (
    <SingleSelectProperty
      {...restProps}
      value={usedValue}
      options={options}
      onChange={setUsedValue}
      onRemove={() => setUsedValue(undefined)}
      hintText={hintText}
    />
  )
}


const meta = {
  title: 'User Action/Property',
  component: SingleSelectPropertyExample,
} satisfies Meta<typeof SingleSelectPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const singleSelectProperty: Story = {
  args: {
    value: undefined,
    name: 'Fruits',
    softRequired: false,
    readOnly: false,
    hintText: 'Select',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'pear', label: 'Pear' },
      { value: 'plum', label: 'Plum' },
      { value: 'strawberry', label: 'Strawberry', disabled: true },
      { value: 'orange', label: 'Orange' },
      { value: 'maracuja', label: 'Maracuja' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'pineapple', label: 'Pineapple' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'watermelon', label: 'Watermelon' },
    ],
  },
}
