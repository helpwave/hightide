import type { Meta, StoryObj } from '@storybook/react'
import { TextareaExample } from '../../../src/components/examples/TextareaExample'

const meta = {
  title: 'User-Action/Input',
  component: TextareaExample,
} satisfies Meta<typeof TextareaExample>

export default meta
type Story = StoryObj<typeof meta>;

export const TextareaVariation: Story = {
  args: {
    value: 'Text',
    label: { name: 'Label' },
    id: 'text',
    headline: '',
    disclaimer: '',
    resizable: false,
    className: '',
  },
}
