import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import clsx from 'clsx'
import { MultiSelectProperty } from '@/src/components/user-interaction/properties/MultiSelectProperty'
import { StorybookHelper } from '@/src/storybook/helper'
import { MultiSelectOption } from '@/src/components/user-interaction/MultiSelect/MultiSelectOption'

const options = StorybookHelper.selectValues

const meta: Meta<typeof MultiSelectProperty> = {
  component: MultiSelectProperty,
}

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectProperty: Story = {
  args: {
    name: 'Fruits',
    required: false,
    value: options.slice(3, 5),
    readOnly: false,
    children: options.map(option => (
      <MultiSelectOption key={option} value={option} label={option}>
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
      </MultiSelectOption>
    )),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onRemove: action('onRemove'),
    onValueClear: action('onValueClear'),
  },
  render: ({ value: initialValue, ...props }) => {
    const [values, setValues] = useState<string[]>(initialValue)

    return (
      <MultiSelectProperty
        {...props}
        value={values}
        onValueChange={(vals) => {
          props.onValueChange?.(vals)
          setValues(vals)
        }}
        onEditComplete={(vals) => {
          props.onEditComplete?.(vals)
          setValues(vals)
        }}
        onValueClear={() => {
          props.onValueClear?.()
          setValues([])
        }}
      />
    )
  }
}
