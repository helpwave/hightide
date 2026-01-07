import type { Meta, StoryObj } from '@storybook/nextjs'
import clsx from 'clsx'
import { PropertyBase } from '@/src/components/user-interaction/properties/PropertyBase'
import { Text } from 'lucide-react'
import { action } from 'storybook/actions'

const meta = {
  component: PropertyBase,
} satisfies Meta<typeof PropertyBase>

export default meta
type Story = StoryObj<typeof meta>;

export const propertyBase: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    hasValue: true,
    readOnly: false,
    allowClear: false,
    icon: <Text size={24}/>,
    onValueClear: action('onValueClear'),
    onRemove: action('onRemove'),
    children: ({ softRequired, hasValue }) => (
      <div
        className={clsx('flex-row-2 grow py-2 px-4', { 'text-warning': softRequired && !hasValue })}
      >
        Value
      </div>
    ),
  },
}
