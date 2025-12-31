import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { StorybookHelper } from '../../../src/storybook/helper'
import clsx from 'clsx'
import { SingleSelectProperty } from '../../../src/components/user-interaction/properties/SelectProperty'
import { SelectOption } from '../../../src/components/user-interaction/Select'

const options = [...StorybookHelper.selectValues]


const meta = {
  component: SingleSelectProperty,
} satisfies Meta<typeof SingleSelectProperty>

export default meta
type Story = StoryObj<typeof meta>;

export const singleSelectProperty: Story = {
  args: {
    value: undefined,
    name: 'Fruits',
    softRequired: false,
    readOnly: false,
    children: options.map(option => (
      <SelectOption key={option} value={option}>
        <span className="flex-row-1 items-center">
          <span
            className={clsx(
              'w-4 h-4 rounded-full',
              {
                'bg-primary': option.length % 3 === 0,
                'bg-secondary': option.length % 3 !== 0,
              }
            )}
          />
          {option}
        </span>
      </SelectOption>
    ))
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<string | undefined>(value)

    return (
      <SingleSelectProperty
        {...props}
        value={usedValue}
        onValueChanged={value => {
          action('onChange')(value)
          setUsedValue(value)
        }}
        onRemove={() => {
          action('onRemove')()
          setUsedValue(undefined)
        }}
      />
    )
  }
}
