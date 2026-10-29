import { action } from 'storybook/actions'
import { MultiSelect } from '../../../../src/components/data-input/selection/MultiSelect/MultiSelect'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>;

const fruitOptions = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Banana', label: 'Banana', disabled: true },
  { value: 'Cherry', label: 'Cherry' },
  { value: 'Dragonfruit', label: 'Dragonfruit', className: '!text-red-400' },
  { value: 'Elderberry', label: 'Elderberry' },
  { value: 'Fig', label: 'Fig' },
  { value: 'Grapefruit', label: 'Grapefruit' },
  { value: 'Honeydew', label: 'Honeydew' },
  { value: 'Indianfig', label: 'Indianfig' },
  { value: 'Jackfruit', label: 'Jackfruit' },
  { value: 'Kiwifruit', label: 'Kiwifruit' },
  { value: 'Lemon', label: 'Lemon', disabled: true }
].sort((a, b) => a.value.localeCompare(b.value))

export const multiSelectChipDisplay: Story = {
  args: {
    initialValue: ['Apple', 'Cherry'],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: (args: typeof MultiSelect.arguments) => (
    <MultiSelect.Root
      initialValue={args.initialValue}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      searchableThreshold={args.searchableThreshold}
      isReadOnly={args.isReadOnly}
      isRequired={args.isRequired}
      onValueChange={args.onValueChange}
      onStateEvent={args.onStateEvent}
    >
      <MultiSelect.ChipDisplayTrigger />
      <MultiSelect.Content>
        {fruitOptions.map((item, index) => (
          <MultiSelect.Option key={index} {...item} />
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>
  ),
}
