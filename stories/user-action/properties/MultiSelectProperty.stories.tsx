import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import type { MultiSelectOption } from '../../../src'
import type { MultiSelectPropertyProps } from '../../../src'
import { MultiSelectProperty } from '../../../src'
import { action } from 'storybook/actions'

type MultiSelectPropertyExample =
  Omit<MultiSelectPropertyProps, 'onChange' | 'onRemove' | 'search' | 'selectedDisplay' | 'options'>

/**
 * Example for using the MultiSelectProperty
 */
const MultiSelectPropertyExample = ({
                                      hintText,
                                      ...restProps
                                    }: MultiSelectPropertyExample) => {
  const [options, setOptions] = useState<MultiSelectOption<string>[]>([
    { value: 'apple', label: 'Apple', selected: false },
    { value: 'pear', label: 'Pear', selected: false },
    { value: 'plum', label: 'Plum', selected: false },
    { value: 'strawberry', label: 'Strawberry', selected: false, disabled: true },
    { value: 'orange', label: 'Orange', selected: false },
    { value: 'maracuja', label: 'Maracuja', selected: false },
    { value: 'lemon', label: 'Lemon', selected: false },
    { value: 'pineapple', label: 'Pineapple', selected: false },
    { value: 'kiwi', label: 'Kiwi', selected: false },
    { value: 'watermelon', label: 'Watermelon', selected: false },
  ].map(value => ({ ...value, searchTags: [value.label] })))


  useEffect(() => {
    setOptions(options => options.map(value => ({ ...value, selected: false })))
  }, [hintText])

  return (
    <MultiSelectProperty
      {...restProps}
      options={options}
      onChange={options => {
        action('onChange')(options)
        setOptions(options)
      }}
      onRemove={() => {
        action('onRemove')()
        setOptions(options.map(value => ({ ...value, selected: false })))
      }}
      onAddNew={value => {
        setOptions(prevState => [...prevState, {
          value,
          label: value,
          selected: true,
          searchTags: [value],
        }])
      }}
      hintText={hintText}
    />
  )
}


const meta = {
  title: 'User Action/Property',
  component: MultiSelectPropertyExample,
} satisfies Meta<typeof MultiSelectPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectProperty: Story = {
  args: {
    name: 'Fruits',
    softRequired: false,
    readOnly: false,
    hintText: 'Select',
  },
}
