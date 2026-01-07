import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import clsx from 'clsx'
import { MultiSelectProperty } from '@/src/components/user-interaction/properties/MultiSelectProperty'
import { SelectOption } from '@/src/components/user-interaction/Select'
import { StorybookHelper } from '@/src/storybook/helper'

const options = StorybookHelper.selectValues

const meta = {
  component: MultiSelectProperty,
} satisfies Meta<typeof MultiSelectProperty>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectProperty: Story = {
  args: {
    value: options.slice(3, 5),
    name: 'Fruits',
    softRequired: false,
    readOnly: false,
    oonRemove: action('onRemove'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
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
  render: ({ value: initialValue, ...props }) => {
    const [values, setValues] = useState<string[]>(initialValue)

    return (
      <MultiSelectProperty
        {...props}
        values={values}
        onValueChange={values => {
          props.onValueChange?.(values)
          setValues(values)
        }}
        onRemove={() => {
          props.onRemove?.()
          setValues([])
        }}
      />
    )
  }
}
