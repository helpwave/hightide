import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import type { SingleSelectPropertyProps } from '../../../src/components/properties/SelectProperty'
import { SingleSelectProperty } from '../../../src/components/properties/SelectProperty'
import { StorybookHelper } from '../../../src/storybook/helper'

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
      options={options}
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
  },
}
