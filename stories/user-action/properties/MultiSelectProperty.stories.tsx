import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import type { MultiSelectOption } from '../../../src/components/user-action/MultiSelect'
import type { MultiSelectPropertyProps } from '../../../src/components/properties/MultiSelectProperty'
import { MultiSelectProperty } from '../../../src/components/properties/MultiSelectProperty'

type MultiSelectPropertyExample = Omit<MultiSelectPropertyProps<string>, 'onChange' | 'onRemove' | 'search' | 'selectedDisplay' > & {
  enableSearch: boolean,
}

/**
 * Example for using the MultiSelectProperty
 */
const MultiSelectPropertyExample = ({
                                             options,
                                             hintText,
                                             enableSearch,
                                             ...restProps
                                           }: MultiSelectPropertyExample) => {
  const [usedOptions, setUsedOptions] = useState<MultiSelectOption<string>[]>(options)

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options.map(value => ({ ...value, selected: false })))
  }, [hintText, options])

  return (
      <MultiSelectProperty
          {...restProps}
          options={usedOptions}
          search={enableSearch ? { initialSearch: '', searchMapping: value => [value.label] } : undefined}
          onChange={setUsedOptions}
          onRemove={() => setUsedOptions(usedOptions.map(value => ({ ...value, selected: false })))}
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
    options: [
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
    ],
    readOnly: false,
    hintText: 'Select',
    enableSearch: true,
    showDisabledOptions: true
  },
}
