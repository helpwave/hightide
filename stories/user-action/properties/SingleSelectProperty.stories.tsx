import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { StorybookHelper } from '../../../src/storybook/helper'
import clsx from 'clsx'
import type { SingleSelectPropertyProps } from '../../../src/components/properties/SelectProperty'
import { SingleSelectProperty } from '../../../src/components/properties/SelectProperty'
import { SelectOption } from '../../../src/components/user-action/Select'

type SingleSelectPropertyExample = Omit<SingleSelectPropertyProps, 'onChange' | 'onRemove' | 'searchMapping' | 'options'>

const options = [...StorybookHelper.selectValues]

/**
 * Example for using the SingleSelectProperty
 */
const SingleSelectPropertyExample = ({
                                       value,
                                       ...restProps
                                     }: SingleSelectPropertyExample) => {
  const [usedValue, setUsedValue] = useState<string | undefined>(value)

  return (
    <SingleSelectProperty
      {...restProps}
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


const meta = {
  title: 'User Action/Property',
  component: SingleSelectPropertyExample,
} satisfies Meta<typeof SingleSelectPropertyExample>

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
}
