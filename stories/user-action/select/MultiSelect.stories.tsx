import { action } from 'storybook/actions'
import type { MultiSelectProps } from '../../../src'
import { MultiSelectUncontrolled } from '../../../src'
import type { Meta, StoryObj } from '@storybook/nextjs'

type MultiSelectExampleProps = Omit<MultiSelectProps<string>, 'selectedDisplayOverwrite'>

const MultiSelectExample = ({
                              hintText,
                              ...props
                            }: MultiSelectExampleProps) => {
  return (
    <MultiSelectUncontrolled
      {...props}
      hintText={hintText}
      className={"max-w-128"}
    />
  )
}


const meta = {
  title: 'User Action/Select',
  component: MultiSelectExample,
} satisfies Meta<
  typeof MultiSelectExample>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelect: Story = {
  args: {
    label: { name: 'Your favourite fruit' },
    isDisabled: false,
    hintText: undefined,
    isSearchEnabled: true,
    useChipDisplay: true,
    className: '',
    onChange: action('onChange'),
    options: [
      { value: 'apple', selected: false, label: 'Apple', searchTags: ['Apple'] },
      { value: 'banana', selected: false, label: 'Banana', disabled: true, searchTags: ['Banana'] },
      { value: 'cherry', selected: false, label: 'Cherry', searchTags: ['Cherry'] },
      {
        value: 'dragonfruit',
        selected: false,
        label: 'Dragonfruit',
        className: '!text-red-400',
        searchTags: ['Dragonfruit']
      },
      { value: 'elderberry', selected: false, label: 'Elderberry', searchTags: ['Elderberry'] },
      { value: 'fig', selected: false, label: 'Fig', disabled: true, searchTags: ['Fig'] },
      { value: 'grapefruit', selected: false, label: 'Grapefruit', searchTags: ['Grapefruit'] },
      { value: 'honeydew', selected: false, label: 'Honeydew', searchTags: ['Honeydew'] },
      { value: 'indianfig', selected: false, label: 'Indian Fig', searchTags: ['Indian Fig'] },
      { value: 'jackfruit', selected: false, label: 'Jackfruit', searchTags: ['Jackfruit'] },
      { value: 'kiwifruit', selected: false, label: 'Kiwifruit', searchTags: ['Kiwifruit'] },
      { value: 'lemon', selected: false, label: 'Lemon', disabled: true, searchTags: ['Lemon'] }
    ],
  },
}
