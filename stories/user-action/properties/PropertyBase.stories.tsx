import type { Meta, StoryObj } from '@storybook/nextjs'
import clsx from 'clsx'
import { PropertyBase } from '../../../src'

const meta = {
  title: 'User Action/Property',
  component: PropertyBase,
} satisfies Meta<typeof PropertyBase>

export default meta
type Story = StoryObj<typeof meta>;

export const propertyBase: Story = {
  args: {
    name: 'Property',
    softRequired: false,
    hasValue: true,
    input: ({ softRequired, hasValue }) => (
      <div
        className={clsx('flex-row-2 grow py-2 px-4', { 'text-warning': softRequired && !hasValue })}
      >
        Value
      </div>
    ),
    className: '',
    readOnly: false,
  },
}
