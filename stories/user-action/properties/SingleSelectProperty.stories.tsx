import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { action } from 'storybook/actions'
import type { SingleSelectPropertyProps } from '../../../src/components/properties/SelectProperty'
import { SingleSelectProperty } from '../../../src/components/properties/SelectProperty'
import type { SelectOption } from '../../../src/components/user-action/select/Select'

type SingleSelectPropertyExample = Omit<SingleSelectPropertyProps, 'onChange' | 'onRemove' | 'searchMapping' | 'options'>

/**
 * Example for using the SingleSelectProperty
 */
const SingleSelectPropertyExample = ({
                                       value,
                                       ...restProps
                                     }: SingleSelectPropertyExample) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)
  const [options, setOptions] = useState<SelectOption<string>[]>(
    [
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
    ].map<SelectOption<string>>(value => ({ ...value, keywords: [value.label] }))
  )


  useEffect(() => {
    if (options.find(value1 => value1.id === value)) {
      setUsedValue(value)
    }
  }, [value, options])

  return (
    <SingleSelectProperty
      {...restProps}
      value={usedValue}
      options={options}
      onChange={value => {
        action('onChange')(value)
        setUsedValue(value)
      }}
      onRemove={() => {
        action('onRemove')()
        setUsedValue(undefined)
      }}
      onAddNew={(value) => {
        setOptions(prevState => [...prevState, {
          id: value,
          label: value,
          keywords: [value],
        }])
        setUsedValue(value)
      }}
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
  },
}
