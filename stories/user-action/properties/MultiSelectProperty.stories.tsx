import type { Meta, StoryObj } from '@storybook/nextjs'
import { useMemo, useState } from 'react'
import { action } from 'storybook/actions'
import type { MultiSelectPropertyProps } from '../../../src/components/properties/MultiSelectProperty'
import { MultiSelectProperty } from '../../../src/components/properties/MultiSelectProperty'
import { StorybookHelper } from '../../../src/storybook/helper'

type MultiSelectPropertyExample =
  Omit<MultiSelectPropertyProps, 'values' | 'search' | 'selectedDisplay' | 'options'>

/**
 * Example for using the MultiSelectProperty
 */
const MultiSelectPropertyExample = ({
                                      ...restProps
                                    }: MultiSelectPropertyExample) => {
  const [values, setValues] = useState<string[]>(StorybookHelper.selectValues.slice(3,4))

  const options = useMemo(() => [...StorybookHelper.selectValues], [])

  return (
    <MultiSelectProperty
      {...restProps}
      values={values}
      options={options}
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
    onValuesChanged: action('onValuesChanged')
  },
}
