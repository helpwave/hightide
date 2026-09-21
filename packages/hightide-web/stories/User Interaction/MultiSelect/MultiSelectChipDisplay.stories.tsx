import { action } from 'storybook/actions'
import { MultiSelect } from '../../../src/components/user-interaction/MultiSelect/MultiSelect'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

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
    disabled: false,
    invalid: false,
    showSearch: false,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args: typeof MultiSelect.arguments) => (
    <MultiSelect.Root
      initialValue={args.initialValue}
      disabled={args.disabled}
      invalid={args.invalid}
      showSearch={args.showSearch}
      readOnly={args.readOnly}
      required={args.required}
      onValueChange={args.onValueChange}
      onEditComplete={args.onEditComplete}
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
