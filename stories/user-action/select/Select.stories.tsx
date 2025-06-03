import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { SelectUncontrolled } from '../../../src/components/user-action/Select'

const meta = {
    title: 'User Action/Select',
    component: SelectUncontrolled<string>,
} satisfies Meta<typeof SelectUncontrolled<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const SelectVariations: Story = {
    args: {
        label: { name: 'Select-Label', labelType: 'labelMedium' },
        value: undefined,
        options: [
            { value: '1', label: 'Entry 1' },
            { value: '2', label: 'Entry 2', disabled: true },
            { value: '3', label: 'Entry 3' },
            { value: '4', label: <span className="!text-red-400">Custom styled</span> },
            { value: '5', label: 'Entry 5' },
            { value: '6', label: 'Entry 6', disabled: true }
        ],
        onChange: action('updated'),
        isDisabled: false,
        hintText: 'Hinttext',
        isHidingCurrentValue: false,
        showDisabledOptions: true,
        className: '',
    },
}
