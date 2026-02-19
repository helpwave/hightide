import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { StorybookHelper } from '@/src/storybook/helper'
import clsx from 'clsx'
import { SingleSelectProperty } from '@/src/components/user-interaction/properties/SelectProperty'
import { SelectOption } from '@/src/components/user-interaction/select/SelectOption'
const options = [...StorybookHelper.selectValues]


const meta: Meta<typeof SingleSelectProperty> = {
  component: SingleSelectProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const singleSelectProperty: Story = {
  args: {
    name: 'Fruits',
    required: false,
    value: undefined,
    readOnly: false,
    children: options.map(option => (
      <SelectOption key={option} value={option} label={option}>
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
    )),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value, ...props }) => {
    const [usedValue, setUsedValue] = useState<string | undefined>(value)

    return (
      <SingleSelectProperty
        {...props}
        value={usedValue}
        onValueChange={(val) => {
          props.onValueChange?.(val)
          setUsedValue(val)
        }}
        onEditComplete={(val) => {
          props.onEditComplete?.(val)
          setUsedValue(val)
        }}
        onValueClear={() => {
          props.onValueClear?.()
          setUsedValue(undefined)
        }}
      />
    )
  }
}
