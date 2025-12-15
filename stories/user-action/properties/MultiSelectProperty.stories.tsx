import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { StorybookHelper } from '../../../src/storybook/helper'
import clsx from 'clsx'
import type { MultiSelectPropertyProps } from '../../../src/components/properties/MultiSelectProperty'
import { MultiSelectProperty } from '../../../src/components/properties/MultiSelectProperty'
import { SelectOption } from '../../../src/components/user-action/Select'

type MultiSelectPropertyExample =
  Omit<MultiSelectPropertyProps, 'values' | 'search' | 'selectedDisplay' | 'options'>

const options = [...StorybookHelper.selectValues]


/**
 * Example for using the MultiSelectProperty
 */
const MultiSelectPropertyExample = ({
                                      ...restProps
                                    }: MultiSelectPropertyExample) => {
  const [values, setValues] = useState<string[]>(options.slice(3, 5))

  return (
    <MultiSelectProperty
      {...restProps}
      values={values}
      onValuesChanged={values => {
        restProps.onValuesChanged?.(values)
        setValues(values)
      }}
      onRemove={() => {
        restProps.onRemove?.()
        setValues([])
      }}
    />
  )
}


const meta = {
  title: 'User Action/Property',
  component: MultiSelectPropertyExample,
} satisfies Meta<typeof MultiSelectPropertyExample>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectProperty: Story = {
  args: {
    name: 'Fruits',
    softRequired: false,
    readOnly: false,
    onRemove: action('onRemove'),
    onValuesChanged: action('onValuesChanged'),
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
}
