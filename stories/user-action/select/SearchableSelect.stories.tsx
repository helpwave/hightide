import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import type { SearchableSelectProps } from '../../../src'
import { SearchableSelect } from '../../../src'

type SearchableSelectExampleProps = Omit<SearchableSelectProps<string>, 'searchMapping' | 'additionalItems'>

/**
 * Example for a Searchable select
 */
const SearchableSelectExample = ({
                                   value,
                                   options,
                                   onChange,
                                   ...props
                                 }: SearchableSelectExampleProps) => {
  const [selected, setSelected] = useState<string | undefined>(value)

  useEffect(() => {
    setSelected(options.find(value1 => value1.value === value)?.value)
  }, [options, value])

  return (
    <SearchableSelect
      {...props}
      value={selected}
      options={options}
      onChange={value => {
        setSelected(value)
        onChange(value)
      }}
      searchMapping={value1 => [value1.value]}
    />
  )
}


const meta = {
  title: 'User Action/Select',
  component: SearchableSelectExample,
} satisfies Meta<typeof SearchableSelectExample>

export default meta
type Story = StoryObj<typeof meta>;

export const SearchableSelectVariations: Story = {
  args: {
    label: { name: 'Select-Label', labelType: 'labelMedium' },
    value: undefined,
    options: [
      { value: 'Entry 1', label: 'Entry 1' },
      { value: 'Entry 2', label: 'Entry 2', disabled: true },
      { value: 'Entry 3', label: 'Entry 3' },
      { value: 'Custom styled', label: <span className="!text-red-400">Custom styled</span> },
      { value: 'Entry 5', label: 'Entry 5' },
      { value: 'Entry 6', label: 'Entry 6', disabled: true }
    ],
    isDisabled: false,
    hintText: 'Hinttext',
    isHidingCurrentValue: false,
    showDisabledOptions: true,
    className: '',
    onChange: action('onChange'),
  },
}
