import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { useEffect, useState } from 'react'
import type { MultiSelectProps } from '../../../src/components/user-action/MultiSelect'
import { MultiSelect } from '../../../src/components/user-action/MultiSelect'
import { ChipList } from '../../../src/components/layout-and-navigation/Chip'

type MultiSelectExampleProps = Omit<MultiSelectProps<string>, 'search' | 'selectedDisplay'> & {
  enableSearch: boolean,
  useChipDisplay: boolean,
}

const MultiSelectExample = ({
                              options,
                              hintText,
                              enableSearch,
                              onChange,
                              useChipDisplay = false,
                              ...props
                            }: MultiSelectExampleProps) => {
  const [usedOptions, setUsedOptions] = useState(options)

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options.map(value => ({ ...value, selected: false })))
  }, [hintText, options])

  return (
    <MultiSelect
      options={usedOptions}
      onChange={value => {
        onChange(value)
        setUsedOptions(value)
      }}
      hintText={hintText}
      search={enableSearch ? { initialSearch: '', searchMapping: value => [value.label] } : undefined}
      selectedDisplay={useChipDisplay ?
        ({ items }) => {
          const selected = items.filter(value => value.selected)
          if (selected.length === 0) {
            return (<span>Select</span>)
          }
          return (
            <ChipList
              list={selected.map(value => ({ children: value.label }))}
            />
          )
        } : undefined}
      {...props}
    />
  )
}


const meta = {
  title: 'User Action/Select',
  component: MultiSelectExample,
} satisfies Meta<typeof MultiSelectExample>

export default meta
type Story = StoryObj<typeof meta>;

export const MultiSelectVariations: Story = {
  args: {
    label: { name: 'Select-Label' },
    options: [
      { value: '1', selected: false, label: 'Entry 1' },
      { value: '2', selected: false, label: 'Entry 2', disabled: true },
      { value: '3', selected: false, label: 'Different Entry 3' },
      { value: '4', selected: false, label: 'Custom styled Entry 4', className: '!text-red-400' },
      { value: '5', selected: false, label: 'Entry 5' },
      { value: '6', selected: false, label: 'Entry 6', disabled: true },
      { value: '7', selected: false, label: 'Long Entry 7' },
      { value: '8', selected: false, label: 'Long Entry 8' },
      { value: '9', selected: false, label: 'Very Long Entry 9' },
      { value: '10', selected: false, label: 'Long Entry 10' },
      { value: '11', selected: false, label: 'Very very Long Entry 11' },
      { value: '12', selected: false, label: 'Entry 12', disabled: true }
    ],
    disabled: false,
    hintText: undefined,
    showDisabledOptions: true,
    useChipDisplay: true,
    enableSearch: false,
    className: '',
    triggerClassName: '',
    onChange: action('onChange'),
  },
}
